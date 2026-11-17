#!/usr/bin/env python3
"""สร้างข้อมูลยาจากบัญชียาของ รพ. (ไฟล์ .xls) + ฉลากยา FDA (openFDA/DailyMed) + RxNorm/RxClass
ใช้: python3 tools/drugdata/build.py <บัญชียา.xls> <โฟลเดอร์ผลลัพธ์>
- ไม่ใส่ราคา และไม่ใส่ชื่อผู้พิมพ์/ข้อมูลภายในอื่นลงผลลัพธ์
- ข้อความทางคลินิกทั้งหมดคัดจากฉลากต้นฉบับ (ไม่เขียนเอง) พร้อม setid/วันที่ของฉลาก"""
import sys,os,re,json,urllib.parse,collections
sys.path.insert(0,os.path.dirname(__file__))
import xlrd, mapping as M
from net import get

OPENFDA='https://api.fda.gov/drug/label.json?search='
KEEP={'boxed_warning':20000,'indications_and_usage':8000,'dosage_and_administration':30000,'contraindications':8000,'warnings_and_cautions':16000,'warnings':16000,
      'adverse_reactions':12000,'drug_interactions':30000,'use_in_specific_populations':14000,'pregnancy':6000,'pediatric_use':5000,'geriatric_use':5000,
      'lactation':5000,'renal_impairment':4000,'hepatic_impairment':4000,'overdosage':6000,'mechanism_of_action':4000}
ROUTE_OF={'oral':{'ORAL','SUBLINGUAL','BUCCAL'},'inj':{'INTRAVENOUS','INTRAMUSCULAR','SUBCUTANEOUS','INTRADERMAL','INTRATHECAL','EPIDURAL','INFILTRATION','INTRAVITREAL','PARENTERAL'},
          'inh':{'RESPIRATORY (INHALATION)','INHALATION','NASAL'},'eye':{'OPHTHALMIC','INTRAOCULAR'},'top':{'TOPICAL','CUTANEOUS','TRANSDERMAL','VAGINAL','RECTAL','OTIC','DENTAL'}}
def route_class(form,name):
    f=(form+' '+name).lower()
    if re.search(r'inj|vial|amphule|amp\b|infusion|intravenous|sterile',f): return 'inj'
    if re.search(r'eye|ophth|opth',f): return 'eye'
    if re.search(r'mdi|inhal|respimat|nebul|\bnb\b|nasal|handihaler|accuhaler|ellipta',f): return 'inh'
    if re.search(r'cream|oint|lotion|gel|shampoo|vagin|paste|enema|supposit|tincture|ear|patch|drop',f): return 'top'
    return 'oral'

def read_items(path):
    sh=xlrd.open_workbook(path,logfile=open(os.devnull,'w')).sheet_by_index(0); items=[]
    for r in range(1,sh.nrows):
        v=sh.row_values(r)
        if not isinstance(v[0],float): continue            # ข้ามบรรทัดท้ายกระดาษ (ชื่อผู้พิมพ์/วันที่พิมพ์)
        raw=str(v[1]).strip(); name=re.sub(r'^\(HAD\)\s*','',raw); note=''
        m=re.search(r'\s-\s*(ไม่มี[^\n]*)',name)
        if m: note=m.group(1).strip(); name=name[:m.start()].strip()
        items.append({'no':int(v[0]),'name':name,'form':str(v[2]).strip(),'unit':str(v[3]).strip(),'had':raw.startswith('(HAD)'),'notInFormulary':bool(note),'noPrice':not (isinstance(v[4],float) and v[4]>0)})
    return items

def map_item(it):
    n=it['name']
    for k,v in M.MANUAL.items():
        if n.lower().startswith(k.lower()) or k.lower() in n.lower().split(' - ')[0].lower():
            return {'status':'manual','ingredients':[{'name':x} for x in v]}
    if M.NONLABEL.search(n): return {'status':'nonlabel','why':'วัคซีน/อิมมูโนโกลบูลิน/สารน้ำ/ผลิตภัณฑ์เฉพาะที่หรืออื่น ๆ — ไม่มีฉลากรายสารออกฤทธิ์ให้ตรวจ'}
    if not re.search(r'[A-Za-z]{3}',n): return {'status':'herbal','why':'ผลิตภัณฑ์ชื่อภาษาไทย (สมุนไพร/อื่น ๆ) — ใช้แหล่งข้อมูลของไทย ไม่ใช่ฉลาก FDA'}
    cs=M.candidates(n); res=[]; why=''
    for c in cs:
        r=M.resolve_term(c)
        if r['status']!='mapped': why=r.get('why','') ; res=[]; break
        res+=r['ingredients']
    if not res: return {'status':'unmapped','why':why or 'จับคู่กับสารออกฤทธิ์ไม่ได้ — ต้องให้เภสัชกรระบุ'}
    seen=set(); out=[]
    for i in res:
        if i['name'] not in seen: seen.add(i['name']); out.append(i)
    return {'status':'mapped','ingredients':out}

def txt(v): return re.sub(r'\s+',' ',' '.join(v) if isinstance(v,list) else str(v)).strip()
def fetch_label(ing,rclass):
    q=OPENFDA+urllib.parse.quote(f'openfda.substance_name:"{ing}" AND openfda.product_type:"HUMAN PRESCRIPTION DRUG"')+'&limit=40'
    d=get(q); res=d.get('results') or []
    if not res:
        d=get(OPENFDA+urllib.parse.quote(f'openfda.generic_name:"{ing}"')+'&limit=40'); res=d.get('results') or []
    best=None
    for r in res:
        o=r.get('openfda',{}); subs=[s.lower() for s in o.get('substance_name',[])]
        routes=set(x.upper() for x in o.get('route',[]))
        sc=0
        sc+=6*sum(1 for k in ('indications_and_usage','dosage_and_administration','contraindications','adverse_reactions','drug_interactions') if r.get(k))
        sc+=3 if len(subs)==1 else 0
        sc+=8 if routes & ROUTE_OF[rclass] else 0
        sc+=2 if o.get('product_type',[''])[0].startswith('HUMAN PRESCRIPTION') else 0
        sc+=min(len(txt(r.get('drug_interactions',''))),6000)/6000
        sc+=int(r.get('effective_time','0'))/1e9      # ใหม่กว่าได้เปรียบเล็กน้อย
        if best is None or sc>best[0]: best=(sc,r)
    if not best: return None
    r=best[1]; o=r.get('openfda',{}); sec={}
    for k,cap in KEEP.items():
        if r.get(k):
            t=txt(r[k]); sec[k]={'t':t[:cap],'trunc':len(t)>cap}
    return {'setid':r.get('set_id'),'effective':r.get('effective_time'),'brands':o.get('brand_name',[])[:4],'manufacturer':(o.get('manufacturer_name') or [''])[0],
            'routes':o.get('route',[]),'substances':o.get('substance_name',[]),'sections':sec}

def classes(ing_rxcui):
    out=[]
    for src in ('EPC','MOA'):
        d=get(M.RX+f'rxclass/class/byRxcui.json?rxcui={ing_rxcui}&relaSource=DAILYMED&relas=has_EPC' if src=='EPC' else M.RX+f'rxclass/class/byRxcui.json?rxcui={ing_rxcui}&relaSource=DAILYMED&relas=has_MoA')
        for x in (d.get('rxclassDrugInfoList') or {}).get('rxclassDrugInfo',[]) or []:
            c=x['rxclassMinConceptItem']['className']
            if c not in out: out.append(c)
    return out

def main(xls,outdir):
    items=read_items(xls); os.makedirs(outdir,exist_ok=True)
    for it in items: it['map']=map_item(it); it['route']=route_class(it['form'],it['name'])
    # ingredient → rxcui
    ing_ids={}
    for it in items:
        for i in it['map'].get('ingredients',[]):
            if 'rxcui' not in i:
                r=M.by_name(i['name']); i['rxcui']=r[0]['rxcui'] if r else ''
            ing_ids[i['name']]=i['rxcui']
    need=collections.defaultdict(set)
    for it in items:
        for i in it['map'].get('ingredients',[]): need[i['name']].add(it['route'])
    labels={}; 
    for n,(ing,routes) in enumerate(sorted(need.items())):
        for rc in sorted(routes):
            L=fetch_label(ing,rc)
            if L: labels[(ing,rc)]=L
        if n%40==0: print('labels',n,'/',len(need),flush=True)
    cls={ing:(classes(ing_ids[ing]) if ing_ids.get(ing) else []) for ing in need}
    json.dump({'items':items,'ing_ids':ing_ids,'labels':{f'{k[0]}|{k[1]}':v for k,v in labels.items()},'classes':cls},open(os.path.join(outdir,'raw.json'),'w'),ensure_ascii=False)
    st=collections.Counter(i['map']['status'] for i in items); print(st)
    print('ingredients',len(need),'with label',len({k[0] for k in labels}))
if __name__=='__main__': main(sys.argv[1],sys.argv[2])

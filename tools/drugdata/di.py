#!/usr/bin/env python3
"""สร้างข้อมูลอันตรกิริยา (DI) จากหัวข้อที่เกี่ยวข้องในฉลากยา FDA ของสารออกฤทธิ์ในบัญชียา
ใช้: python3 tools/drugdata/di.py <raw.json> <โฟลเดอร์ public/drugdata>
หลักการ: ไม่เขียนแนวทางจัดการเอง — เก็บ 'ประโยค' จากฉลากที่กล่าวถึงยาอีกตัว/กลุ่มยา พร้อมหัวข้อที่พบและที่มาของฉลาก
ระดับความรุนแรงจัดอัตโนมัติจากถ้อยคำในประโยค (contraindicated > avoid > monitor > info) — ไม่ใช่ระดับจากฐานข้อมูล DI"""
import sys,os,re,json,collections
SEC=['boxed_warning','contraindications','drug_interactions','warnings_and_cautions','warnings','dosage_and_administration']
DIRECT_SEC={'boxed_warning','contraindications','drug_interactions','warnings_and_cautions','warnings'}   # ชื่อยาในหัวข้อขนาดยาไม่นับเป็น DI (มักเป็นข้อความอื่น)
SEC_TH={'boxed_warning':'คำเตือนกรอบดำ','contraindications':'ข้อห้ามใช้','drug_interactions':'อันตรกิริยา','warnings_and_cautions':'คำเตือน/ข้อควรระวัง','warnings':'คำเตือน','dosage_and_administration':'ขนาดและการให้ยา'}
REV={'albuterol':['salbutamol'],'acetaminophen':['paracetamol'],'epinephrine':['adrenaline'],'norepinephrine':['noradrenaline'],'meperidine':['pethidine'],'rifampin':['rifampicin'],'glyburide':['glibenclamide'],'valproic acid':['valproate','divalproex','valproate sodium'],'potassium chloride':['potassium supplements'],'furosemide':['frusemide']}
# กลุ่มยาที่ฉลากมักเขียนเป็นชื่อกลุ่ม: (รหัสกลุ่ม, regex ในข้อความฉลาก, regex ชื่อกลุ่ม RxClass ที่สารต้องอยู่)
CLASSES=[
 ('nsaid',r'\bnsaids?\b|non-?steroidal anti-?inflammatory','Nonsteroidal Anti-inflammatory'),
 ('acei',r'\bace[- ]?inhibitors?\b|angiotensin[- ]converting enzyme inhibitors?','Angiotensin Converting Enzyme Inhibitor'),
 ('arb',r'\barbs?\b|angiotensin (ii )?receptor (blockers?|antagonists?)','Angiotensin 2 Receptor Blocker|Angiotensin II Receptor Blocker'),
 ('bb',r'beta[- ]?(adrenergic )?(receptor )?(blockers?|blocking agents?|antagonists?)','beta-Adrenergic Blocker|Beta-Adrenergic Blocker'),
 ('ccb',r'calcium[- ]channel (blockers?|antagonists?)','Calcium Channel Blocker'),
 ('kspare',r'potassium[- ]sparing diuretics?','Potassium-sparing|Aldosterone Antagonist'),
 ('thiazide',r'thiazide','Thiazide'),
 ('loop',r'loop diuretics?','Loop Diuretic'),
 ('anticoag',r'anticoagulants?','Anticoagulant|Factor Xa Inhibitor|Vitamin K Antagonist|Thrombin Inhibitor|Heparin'),
 ('antiplt',r'antiplatelet|platelet aggregation inhibitors?','Platelet Aggregation Inhibitor|P2Y12'),
 ('ssri',r'\bssris?\b|selective serotonin reuptake inhibitors?','Serotonin Reuptake Inhibitor'),
 ('maoi',r'\bmaois?\b|monoamine oxidase inhibitors?','Monoamine Oxidase Inhibitor'),
 ('tca',r'tricyclic antidepressants?','Tricyclic Antidepressant'),
 ('bzd',r'benzodiazepines?','Benzodiazepine'),
 ('opioid',r'opioids?|opiate','Opioid'),
 ('statin',r'statins?|hmg-?coa reductase inhibitors?','HMG-CoA Reductase Inhibitor'),
 ('sulfonylurea',r'sulfonylureas?','Sulfonylurea'),
 ('cortico',r'corticosteroids?|glucocorticoids?','Corticosteroid|Glucocorticoid'),
 ('antacid',r'antacids?|aluminum[- ]?(and|or|/)?[- ]?magnesium|aluminium|magnesium[- ]containing','Antacid'),
 ('cyp3a4_inh',r'cyp ?3a4? inhibitors?|cyp ?3a inhibitors?|(strong|moderate)[^.]{0,30}cyp ?3a','Cytochrome P450 3A4 Inhibitors|Cytochrome P450 3A Inhibitors'),
 ('cyp3a4_ind',r'cyp ?3a4? inducers?|cyp ?3a inducers?','Cytochrome P450 3A4 Inducers|Cytochrome P450 3A Inducers'),
 ('cyp2d6_inh',r'cyp ?2d6 inhibitors?','Cytochrome P450 2D6 Inhibitors'),
 ('cyp2c9_inh',r'cyp ?2c9 inhibitors?','Cytochrome P450 2C9 Inhibitors'),
 ('cyp2c19_inh',r'cyp ?2c19 inhibitors?','Cytochrome P450 2C19 Inhibitors'),
 ('pgp_inh',r'p-?gp inhibitors?|p-glycoprotein inhibitors?','P-Glycoprotein Inhibitors'),
 ('qt',r'qt[- ]?(interval )?prolong|prolong(ing|s)? the qt|torsade','QT'),
 ('anticonv',r'anticonvulsants?|antiepileptic','Anti-epileptic|Anticonvulsant'),
 ('cns_dep',r'cns depressants?|central nervous system depressants?|sedative','Central Nervous System Depressant'),
]
CUE_CI=re.compile(r'contraindicat|must not|should not be (co-?administered|used|given|taken)|do not (co-?administer|use|give)|never ',re.I)
CUE_AV=re.compile(r'\bavoid|not recommended|should be avoided|concomitant use of .{0,60} (with|and) .{0,60} (is|are) not|not be used (together|concomitantly)',re.I)
CUE_MO=re.compile(r'monitor|adjust|reduc|decreas|increas|caution|consider|may (result|lead|cause|enhance|potentiate|diminish|alter|affect|increase|decrease)|dose|titrat|observe|check|risk of|bleeding|toxicit|serotonin syndrome|qt|torsade|hypotension|hyperkal|hypokal|myopathy|rhabdomyolysis|respiratory depression|sedation|exposure|auc\b|cmax|plasma (concentration|level)|serum (concentration|level)|displace|potentiat|synerg|additive',re.I)
NEG=re.compile(r'no (clinically )?(significant|relevant|meaningful|dose adjustment)|did not (affect|alter|change|result|have)|not (affected|altered)|no (effect|interaction|change|pharmacokinetic)|without (any )?(significant|clinical)|not expected to|no need to|not (clinically )?(significant|relevant)',re.I)
RANK={'contraindicated':3,'avoid':2,'monitor':1,'info':0}
def sev(sentence,section):
    if NEG.search(sentence): return None
    if CUE_CI.search(sentence): return 'contraindicated'
    if section=='contraindications': return 'contraindicated'
    if CUE_AV.search(sentence): return 'avoid'
    if CUE_MO.search(sentence): return 'monitor'
    return 'info'
def sentences(t):
    t=re.sub(r'\s+',' ',t)
    parts=re.split(r'(?<=[.;:!?])\s+(?=[A-Z0-9•\[(])|\s+•\s+|\s+\d+\.\d+(?:\.\d+)?\s+(?=[A-Z])',t)
    return [p.strip() for p in parts if 25<=len(p.strip())]
def window(sn,m,before=170,after=330):
    if len(sn)<=before+after: return sn
    a=max(0,m.start()-before); b=min(len(sn),m.end()+after)
    a=sn.rfind(' ',0,a+1) if a>0 and sn[a-1]!=' ' else a
    b=sn.find(' ',b) if b<len(sn) and sn[b]!=' ' else b
    b=len(sn) if b==-1 else b
    return ('… ' if a>0 else '')+sn[max(a,0):b].strip()+(' …' if b<len(sn) else '')
def slug(n): return re.sub(r'[^a-z0-9]+','-',n.lower()).strip('-')
def main(raw,outdir):
    R=json.load(open(raw)); os.makedirs(os.path.join(outdir,'monographs'),exist_ok=True); os.makedirs(os.path.join(outdir,'di'),exist_ok=True)
    labels=collections.defaultdict(list)
    for k,L in R['labels'].items():
        ing,rc=k.split('|')
        for x in (L if isinstance(L,list) else [L]): labels[ing].append(dict(x,route=rc))
    ings=sorted({i['name'] for it in R['items'] for i in it['map'].get('ingredients',[])})
    # สมาชิกของกลุ่มยา (จาก RxClass ของแต่ละสาร)
    member={}
    for ing in ings:
        cl=R['classes'].get(ing,[]); ks=[]
        for code,_,cre in CLASSES:
            if any(re.search(cre,c,re.I) for c in cl): ks.append(code)
        member[ing]=ks
    brands={ing:{b.lower() for L in labels.get(ing,[]) for b in L['brands'] if len(b)>=4} for ing in ings}
    def alias_re(ing):
        names={ing}|set(REV.get(ing,[]))|brands.get(ing,set())
        base=ing.split(',')[0]
        return re.compile('|'.join(r'(?<![a-z])'+re.escape(n)+r'(?![a-z])' for n in sorted(names,key=len,reverse=True)),re.I)
    ARE={ing:alias_re(ing) for ing in ings}
    CRE={code:re.compile(rx,re.I) for code,rx,_ in CLASSES}
    total=0
    for ing in ings:
        Ls=labels.get(ing,[])
        partners=collections.defaultdict(list); classhits=collections.defaultdict(list)
        for L in Ls:
            for sec in SEC:
                s=L['sections'].get(sec)
                if not s: continue
                for sn in sentences(s['t']):
                    if sec in DIRECT_SEC:
                        for other in ings:
                            if other==ing: continue
                            m=ARE[other].search(sn)
                            if not m: continue
                            sv=sev(sn,sec)
                            if sv: partners[other].append({'s':sv,'sec':sec,'t':window(sn,m),'setid':L['setid']})
                    for code,rx in CRE.items():
                        m=rx.search(sn)
                        if m:
                            sv=sev(sn,sec)
                            if sv: classhits[code].append({'s':sv,'sec':sec,'t':window(sn,m),'setid':L['setid']})
        def keep(h):
            seen=set(); out=[]
            for x in sorted(h,key=lambda x:(-RANK[x['s']],SEC.index(x['sec']))):
                if x['t'] in seen: continue
                seen.add(x['t']); out.append(x)
                if len(out)>=2: break
            return out
        data={'ingredient':ing,'hasLabel':bool(Ls),'partners':{k:keep(v) for k,v in partners.items() if v},'classes':{k:keep(v) for k,v in classhits.items() if v}}
        json.dump(data,open(os.path.join(outdir,'di',slug(ing)+'.json'),'w'),ensure_ascii=False,separators=(',',':')); total+=len(data['partners'])
        mono={'ingredient':ing,'rxcui':R['ing_ids'].get(ing,''),'classes':R['classes'].get(ing,[]),'labels':[{'route':L['route'],'setid':L['setid'],'effective':L['effective'],'brands':L['brands'],'manufacturer':L['manufacturer'],'sections':L['sections']} for L in Ls]}
        json.dump(mono,open(os.path.join(outdir,'monographs',slug(ing)+'.json'),'w'),ensure_ascii=False,separators=(',',':'))
    items=[{'no':it['no'],'name':it['name'],'form':it['form'],'unit':it['unit'],'had':it['had'],'notInFormulary':it['notInFormulary'],'route':it['route'],
            'status':it['map']['status'],'why':it['map'].get('why',''),'ingredients':[{'name':i['name'],'slug':slug(i['name']),'hasLabel':bool(labels.get(i['name']))} for i in it['map'].get('ingredients',[])]} for it in R['items']]
    json.dump({'built':'auto','source':'openFDA drug label (FDA SPL) · RxNorm/RxClass (NLM)','items':items,'membership':member,
               'classes':{c:{'label':c} for c,_,_ in CLASSES}},open(os.path.join(outdir,'index.json'),'w'),ensure_ascii=False,separators=(',',':'))
    print('ingredients',len(ings),'with label',sum(1 for i in ings if labels.get(i)),'direct partner hits',total)
if __name__=='__main__': main(sys.argv[1],sys.argv[2])

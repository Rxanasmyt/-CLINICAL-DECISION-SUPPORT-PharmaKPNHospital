# จับคู่รายการในบัญชียาของ รพ. กับสารออกฤทธิ์มาตรฐาน (RxNorm) — ใช้กฎเข้ม: ไม่รับการเดาที่ไม่แน่ใจ
import re
from net import get
import urllib.parse
RX='https://rxnav.nlm.nih.gov/REST/'
THAI=re.compile(r'[฀-๿]')
LEAD=re.compile(r'^\s*[\d.,]+\s*(mg|ml|g|%|mcg|iu|mu|unit|units|กรัม|มก)\.?\s*',re.I)
STOP=r'\b(PL|CV|GPO|NED|DUE|NB|new|refer back|inj\.?|injection|solution|susp\w*|syrup|syr|sry|tablet|tab\.?|cap\w*|vial|amphule|amp|cream|ointment|oint\.?|lotion|drops?|eye|ear|oral|film|coated|SR|XR|ER|CR|MR|DR|OD|ODT|EC|FC|tablets|capsules|powder|for|and|in|with|inhaler|MDI|nebulizer|vaccines?|vaginal|vagina|troche|paste|irrigation|mouth wash)\b'
def clean(name):
    s=name
    for _ in range(3): s=LEAD.sub('',s)
    return s
def candidates(name):
    s=re.sub(r'\([^)]*\)','',clean(name)); s=re.sub(STOP,' ',s,flags=re.I); s=THAI.sub(' ',s)
    s=re.split(r'\d',s,maxsplit=1)[0]; s=re.sub(r'[-,;:/.*]+',' ',s).replace('+',' + ')
    return [re.sub(r'\s+',' ',p).strip() for p in re.split(r'\s\+\s',s) if p.strip()]
# ที่ไม่ใช่ยาที่มีฉลากรายสารออกฤทธิ์: วัคซีน/อิมมูโนโกลบูลิน/สารน้ำ/ผลิตภัณฑ์เฉพาะที่และอื่น ๆ
NONLABEL=re.compile(r'vaccin|วัคซีน|\bBCG\b|\bMMR\b|\bIPV\b|\bOPV\b|\bDTP\b|\bdT\b|TdaP|\bJE\b|HPV|immun|globulin|ERIG|HRIG|HBIG|antiven|antitox|ANTI TOXIN|sera|\bNSS\b|ringer|water|alcohol|ORS|zinc paste|Swiff|enema|multivit|Pan Enteral|balm|HIBISCRUB|chlorhexidine|Sinopharm|Pfizer|AstraZeneca|Sinovac|covid|corona',re.I)
# แมปด้วยมือ (ผู้พัฒนาตรวจแล้วว่าเป็นสารออกฤทธิ์ใด) — เฉพาะที่มั่นใจ รอเภสัชกรยืนยัน
MANUAL={
 'ASPIRIN Baby':['aspirin'],'ASPIRIN Gr.V':['aspirin'],'ATArax Hydroxyzine SYR':['hydroxyzine'],'Hydroxyzine ATARAX':['hydroxyzine'],
 'BENZHEXOL':['trihexyphenidyl'],'Benzhexol':['trihexyphenidyl'],'CLOTRIMAZOLE VAGINA':['clotrimazole'],'Clotrimazole Troche':['clotrimazole'],'Clotrimazole VAGINAL':['clotrimazole'],
 'Depakine':['valproic acid'],'Depakine chrono':['valproic acid'],'Diprosone':['betamethasone'],'E.KCl':['potassium chloride'],'Guafenesin':['guaifenesin'],
 'HYDRALAZINE Apresoline':['hydralazine'],'L thyrosine':['levothyroxine'],'levothyroxine Elthroxin':['levothyroxine'],'MOM MILK OF MAGNESIA':['magnesium hydroxide'],
 'OXYTOCIN Syntocinon':['oxytocin'],'Rifafour e':['rifampin','isoniazid','pyrazinamide','ethambutol'],'SALBUTAMOL SULFATE NB':['albuterol'],'Spiolto Respimat':['tiotropium','olodaterol'],
 'spiriva handihaler':['tiotropium'],'Tazocin':['piperacillin','tazobactam'],'TRIAMCINOLONE PASTE KENALOG':['triamcinolone'],'Utrogestan':['progesterone'],'Xylocaine viscous':['lidocaine'],
 'simeTHICONE SUS':['simethicone'],'Novomix':['insulin aspart'],'Mixtard':['insulin human'],'GENSULIN N':['insulin human'],'MIXED INSULIN':['insulin human'],
 'Berodual NB':['ipratropium'],'berODUAL MDI':['ipratropium'],'Seretide accuhaler':['fluticasone','salmeterol'],'Amoxi clav':['amoxicillin','clavulanate'],
}
SYN={'salbutamol':'albuterol','paracetamol':'acetaminophen','adrenaline':'epinephrine','noradrenaline':'norepinephrine','pethidine':'meperidine','frusemide':'furosemide','glibenclamide':'glyburide','lignocaine':'lidocaine','rifampicin':'rifampin','benzhexol':'trihexyphenidyl','ceftriazone':'ceftriaxone','ethambutal':'ethambutol','doxazocin':'doxazosin','dicloxacillin':'dicloxacillin','cpz':'chlorpromazine','ptu':'propylthiouracil','pza':'pyrazinamide','hctz':'hydrochlorothiazide','epo':'epoetin','azt':'zidovudine','kcl':'potassium chloride'}
def syn(t):
    return ' '.join(SYN.get(w.lower(),w) for w in t.split())
def tokens(s): return [t for t in re.findall(r'[a-z]{4,}',s.lower())]
def plausible(term,ing):
    """การจับคู่แบบประมาณรับเมื่อชื่อสารตรงกับคำในชื่อจริง ๆ (ไม่ใช่เดาจากความคล้ายของตัวอักษร)"""
    tt=tokens(term); il=ing.lower()
    return any(t[:5]==il[:5] or il.startswith(t[:5]) or t in il or il.split()[0] in t for t in tt)
def ingredients(rxcui):
    d=get(RX+f'rxcui/{rxcui}/related.json?tty=IN+MIN+PIN'); out=[]
    for g in d.get('relatedGroup',{}).get('conceptGroup',[]) or []:
        for c in g.get('conceptProperties',[]) or []: out.append({'rxcui':c['rxcui'],'name':c['name'].lower(),'tty':g['tty']})
    if not out:
        p=get(RX+f'rxcui/{rxcui}/properties.json').get('properties',{})
        if p.get('tty') in ('IN','PIN','MIN'): out=[{'rxcui':rxcui,'name':p['name'].lower(),'tty':p['tty']}]
    # ใช้เฉพาะสารเดี่ยว (IN/PIN) ถ้ามี MIN ให้แตกเป็นสารเดี่ยว
    ins=[o for o in out if o['tty'] in ('IN','PIN')]
    ing=[o for o in ins if o['tty']=='IN']
    names=[o['name'] for o in ing]
    ins=ing or ins
    return ins or out
def by_name(name):
    d=get(RX+'rxcui.json?name='+urllib.parse.quote(name)+'&search=2'); ids=d.get('idGroup',{}).get('rxnormId') or []
    return ingredients(ids[0]) if ids else []
def resolve_term(term):
    t=syn(term.strip())
    if len(t)<3: return {'status':'unmapped','why':'ชื่อสั้นเกินไป'}
    d=get(RX+'rxcui.json?name='+urllib.parse.quote(t)+'&search=2'); ids=d.get('idGroup',{}).get('rxnormId') or []
    if ids:
        ing=ingredients(ids[0]); return {'status':'mapped','how':'exact','ingredients':ing} if ing else {'status':'unmapped','why':'ไม่พบสารออกฤทธิ์'}
    d=get(RX+'approximateTerm.json?term='+urllib.parse.quote(t)+'&maxEntries=3')
    c=sorted(d.get('approximateGroup',{}).get('candidate',[]) or [],key=lambda x:-float(x['score']))
    if not c: return {'status':'unmapped','why':'ไม่พบใน RxNorm'}
    top=c[0]; sc=float(top['score']); ing=ingredients(top['rxcui'])
    if sc>=8 and ing and all(plausible(t,i['name']) or any(plausible(t,j['name']) for j in ing) for i in ing[:1]):
        return {'status':'mapped','how':'approx:%.1f'%sc,'ingredients':ing}
    return {'status':'unmapped','why':'จับคู่ไม่แน่ใจ ('+(ing[0]['name'] if ing else '?')+')'}

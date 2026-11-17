import urllib.request,urllib.parse,json,time,os,ssl,hashlib
CACHE='/tmp/claude-0/drug/cache'; os.makedirs(CACHE,exist_ok=True)
ctx=ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt')
def get(url,retries=3):
    k=os.path.join(CACHE,hashlib.md5(url.encode()).hexdigest()+'.json')
    if os.path.exists(k): return json.load(open(k))
    for a in range(retries):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'drug-data-builder'})
            with urllib.request.urlopen(req,timeout=40,context=ctx) as r: d=json.loads(r.read().decode('utf-8','replace'))
            json.dump(d,open(k,'w')); time.sleep(0.06); return d
        except urllib.error.HTTPError as e:
            if e.code==404: json.dump({'_404':True},open(k,'w')); return {'_404':True}
            time.sleep(1.5*(a+1))
        except Exception as e:
            time.sleep(1.5*(a+1))
    return {'_err':True}

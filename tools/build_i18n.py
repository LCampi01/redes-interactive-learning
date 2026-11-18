# Genera js/i18n/en.js a partir de i18n/es/*.json (originales) e i18n/en/*.json (traducciones).
#   python -I tools/build_i18n.py
# El diccionario va de texto en español a texto en inglés; el motor lo aplica al cambiar de idioma.
import io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ES, EN = os.path.join(ROOT, 'i18n', 'es'), os.path.join(ROOT, 'i18n', 'en')
dic, missing, total = {}, [], 0
for f in sorted(os.listdir(ES)):
    if not f.endswith('.json'):
        continue
    es = json.loads(io.open(os.path.join(ES, f), encoding='utf-8').read())
    pn = os.path.join(EN, f)
    if not os.path.exists(pn):
        missing.append(f)
        continue
    en = json.loads(io.open(pn, encoding='utf-8').read())
    if len(en) != len(es):
        missing.append(f + ' (cantidad distinta)')
        continue
    for a, b in zip(es, en):
        total += 1
        if isinstance(b, str) and b.strip() and b != a:
            dic[a] = b
out = '/* Generado por tools/build_i18n.py: no editar a mano (editar i18n/en/*.json y regenerar). */\nwindow.I18N_EN = ' + json.dumps(dic, ensure_ascii=False, separators=(',', ':')) + ';\n'
os.makedirs(os.path.join(ROOT, 'js', 'i18n'), exist_ok=True)
io.open(os.path.join(ROOT, 'js', 'i18n', 'en.js'), 'w', encoding='utf-8', newline='\n').write(out)
sys.stdout.buffer.write(('en.js: %d entradas de %d textos (%d KB)\n' % (len(dic), total, len(out.encode('utf-8')) // 1024)).encode('utf-8'))
if missing:
    sys.stdout.buffer.write(('SIN TRADUCIR: ' + ', '.join(missing) + '\n').encode('utf-8'))

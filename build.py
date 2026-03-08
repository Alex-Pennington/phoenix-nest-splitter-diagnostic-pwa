import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with open('src/shell.html', 'r', encoding='utf-8') as f:
    shell = f.read()

css_files = [
    'src/styles/base.css', 'src/styles/install.css', 'src/styles/wiring.css', 'src/styles/tracer.css',
    'src/styles/troubleshoot.css', 'src/styles/simulator.css', 'src/styles/labels.css'
]
js_files = [
    'src/data/wires.js', 'src/data/circuits.js', 'src/data/troubleshoot.js',
    'src/data/relay-pins.js', 'src/data/install-steps.js',
    'src/modules/nav.js', 'src/modules/tab-install.js', 'src/modules/tab-wiring.js',
    'src/modules/tab-tracer.js', 'src/modules/tab-troubleshoot.js',
    'src/modules/tab-labels.js', 'src/modules/tab-simulator.js'
]

css = '\n'.join(open(f, encoding='utf-8').read() for f in css_files)
js = '\n'.join(open(f, encoding='utf-8').read() for f in js_files)

shell = shell.replace('/* __CSS_INJECT__ */', css)
shell = shell.replace('/* __JS_INJECT__ */', js)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(shell)

print(f"Built index.html ({len(shell)} bytes)")
print(f"  CSS: {len(css)} bytes from {len(css_files)} files")
print(f"  JS:  {len(js)} bytes from {len(js_files)} files")

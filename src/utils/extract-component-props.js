const { Project } = require('ts-morph');
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');

// directory of aceternity components
const LIB_DIR = path.resolve(__dirname, '../aceternity-components-library/components/ui');
const OUTPUT = path.resolve(__dirname, '../props/component-props.json');

(async () => {
  const project = new Project({ tsConfigFilePath: path.resolve(__dirname, '../aceternity-components-library/tsconfig.json') });

  // find all *.types.ts files under ui
  const files = await fg(['**/*.types.ts'], { cwd: LIB_DIR, absolute: true });

  const result = {};

  files.forEach(file => {
    project.addSourceFileAtPath(file);
  });

  project.getSourceFiles().forEach(sf => {
    // assume same folder name as component
    const dir = path.basename(path.dirname(sf.getFilePath()));

    const propsInterface = sf.getInterfaces().find(i => /Props$/.test(i.getName()));
    if (!propsInterface) return;

    const props = {};
    propsInterface.getProperties().forEach(p => {
      const name = p.getName();
      const type = p.getType().getText();
      props[name] = type;
    });

    result[dir] = props;
  });

  // After extracting typed props we will ensure every component gets at least placeholder props
  const genericPlaceholder = {
    children: 'React.ReactNode',
    className: 'string',
    style: 'React.CSSProperties',
    textSize: 'string', // tailwind size keys xs..9xl
    color: 'string' // any css color string
  };

  const componentDirs = fs.readdirSync(LIB_DIR).filter(dir => fs.statSync(path.join(LIB_DIR, dir)).isDirectory());
  componentDirs.forEach(dir => {
    if (!result[dir]) {
      result[dir] = { ...genericPlaceholder, __placeholder: true };
    } else {
      // ensure generic keys exist
      Object.entries(genericPlaceholder).forEach(([k, v]) => {
        if (!(k in result[dir])) {
          result[dir][k] = v;
        }
      });
    }
  });

  // ensure output dir
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
  console.log(`Extracted props for ${Object.keys(result).length} components -> props/component-props.json`);
})(); 
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export class HandlebarsAdapter {
  compile(mail: any, callback: (err?: any) => void) {
    try {
      const templatePath = join(process.cwd(), mail.data.template + '.hbs');
      const templateSource = readFileSync(templatePath, 'utf8');

      const template = Handlebars.compile(templateSource);

      const html = template(mail.data.context || {});
      mail.data.html = html;

      callback();
    } catch (err) {
      callback(err);
    }
  }
}
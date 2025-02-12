import puppeteer from 'puppeteer';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const safeText = (text) => (text && typeof text === 'string') ? text : (text && typeof text === 'number' ? text.toString() : '');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const targetUrl = 'https://joaoemiliioleiloeiro.com';
  const forDevsUrl = 'https://www.4devs.com.br/gerador_de_pessoas';

  await page.goto(forDevsUrl, { waitUntil: 'networkidle2' });

  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.click('#bt_gerar_pessoa');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('#btn_json_tab', { timeout: 3000 });
  await page.click('#btn_json_tab');
  await new Promise(resolve => setTimeout(resolve, 2000));

  await page.waitForSelector('#dados_json', { timeout: 3000 });

  const jsonData = await page.$eval('#dados_json', (textarea) => {
    return JSON.parse(textarea.value);
  });

  console.log(jsonData);

  const cadastro = {
    target: targetUrl,
    nome: safeText(jsonData[0].nome),
    email: safeText(jsonData[0].email),
    senha: 'SenhaSegura123!',
    cpf: safeText(jsonData[0].cpf),
    data_nascimento: safeText(jsonData[0].data_nasc),
    celular: safeText(jsonData[0].celular),
    cep: safeText(jsonData[0].cep),
    rua: safeText(jsonData[0].endereco),
    n_casa: safeText(jsonData[0].numero),
    bairro: safeText(jsonData[0].bairro),
    cidade: safeText(jsonData[0].cidade),
    estado: safeText(jsonData[0].estado),
    complemento: safeText(jsonData[0].complemento),
    redesocial: 'google',
    novidades_whatsapp: true,
    novidades_email: true,
    termos: true
  };

  console.log(cadastro);

  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.goto(`${targetUrl}/auth/register`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="nome"]', { timeout: 3000 });

  await page.type('input[name="nome"]', cadastro.nome);
  await page.type('input[name="email"]', cadastro.email);
  await page.type('input[name="emailConfirmacao"]', cadastro.email);
  await page.type('input[name="senha"]', cadastro.senha);
  await page.type('input[name="cpf"]', cadastro.cpf);
  await page.type('input[name="data_nascimento"]', cadastro.data_nascimento);
  await page.type('input[name="celular"]', cadastro.celular);
  await page.type('input[name="cep"]', cadastro.cep);
  await page.type('input[name="rua"]', cadastro.rua);
  await page.type('input[name="n_casa"]', cadastro.n_casa);
  await page.type('input[name="bairro"]', cadastro.bairro);
  await page.type('input[name="cidade"]', cadastro.cidade);
  await page.type('input[name="estado"]', cadastro.estado);
  await page.type('input[name="complemento"]', cadastro.complemento);
  await page.select('select[name="redesocial"]', cadastro.redesocial);

  // Marcar checkboxes
  // await page.click('input[name="novidades_whatsapp"]');
  // await page.click('input[name="novidades_email"]');
  // await page.click('input[name="termos"]');

  // Enviar formulário
  await page.click('button[type="submit"]');

  // Esperar pela resposta do cadastro
  await page.waitForSelector('.css-dene45', { timeout: 2000 }).catch(() => {
    console.log('Cadastro concluído com sucesso. #handless');
  });

  const filePath = 'public/cadastro.json';

  if (existsSync(filePath)) {
    const existingData = JSON.parse(readFileSync(filePath, 'utf-8'));
    existingData.push(cadastro);
    writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  } else {
    writeFileSync(filePath, JSON.stringify([cadastro], null, 2));
  }

  await browser.close();
})();

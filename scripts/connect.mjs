import puppeteer from 'puppeteer';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { faker } from '@faker-js/faker';
import { generate } from 'gerador-validador-cpf';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const targetUrl = 'https://joaoemiliioleiloeiro.com';

  await page.goto( `${targetUrl}/auth/register`, { waitUntil: 'networkidle2' });

  // Aguardar o elemento antes de interagir
  await page.waitForSelector('input[name="nome"]', { timeout: 20000 });

  // Gerar dados fictícios
  const cadastro = {
    target: targetUrl,
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: 'SenhaSegura123!',
    cpf: generate(),
    data_nascimento: '1990-01-01',
    celular: faker.phone.number('(##) 9####-####'),
    cep: faker.location.zipCode(),
    rua: faker.location.street(),
    n_casa: faker.number.int({ min: 1, max: 9999 }).toString(),
    bairro: faker.location.secondaryAddress(),
    cidade: faker.location.city(),
    estado: faker.location.state({ abbreviated: true }),
    complemento: faker.location.direction(),
    redesocial: 'google',
    novidades_whatsapp: true,
    novidades_email: true,
    termos: true
  };

  // Preencher formulário
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

  // Aguardar um tempo extra após o carregamento
  // Substituir waitForTimeout() deprecado
  await new Promise(resolve => setTimeout(resolve, 2000));  

  // Clicar no botão de envio
  await page.click('button[type="submit"]');

  // Esperar pela resposta do cadastro
  await page.waitForSelector('.css-dene45', { timeout: 2000 }).catch(() => {
    console.log('Cadastro concluído com sucesso. #handless');
  });

  // Caminho do arquivo JSON
  const filePath = 'public/cadastro.json';

  // Verificar se o arquivo existe
  if (existsSync(filePath)) {
    // Ler dados existentes
    const existingData = JSON.parse(readFileSync(filePath, 'utf-8'));
    // Adicionar novo cadastro
    existingData.push(cadastro);
    // Escrever de volta no arquivo
    writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  } else {
    // Se o arquivo não existir, criar um novo com o cadastro
    writeFileSync(filePath, JSON.stringify([cadastro], null, 2));
  }

  // Aguardar um tempo extra após o carregamento
  // Substituir waitForTimeout() deprecado
  await new Promise(resolve => setTimeout(resolve, 4000));

  await browser.close();
})();
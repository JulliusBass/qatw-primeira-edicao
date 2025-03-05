import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { cleanJobs, getJob } from '../support/redis';
// import { LoginActions } from '../actions/LoginActions';


test('Não Deve logar quando o código de autenticação é invalido', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informa2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});


test('Deve acessar a conta do usuário', async ({ page }) => {
  
  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs()
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  // Checkpoint
  await page.getByRole('heading', {name: 'Verificação em duas etapas'})
    .waitFor({timeout: 3000})

  const codigo = await getJob()  

  // const codigo = await obterCodigo2FA(usuario.cpf)
  
  await loginPage.informa2FA(codigo)

  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
  
});

// Usar Actions só para projetos pequenos

// test('Deve acessar a conta do usuário 2', async ({ page }) => {
  
//   const loginActions = new LoginActions(page)
  
//   const usuario = {
//     cpf: '00000014141',
//     senha: '147258'
//   }
  
//   await loginActions.acessaPagina()
//   await loginActions.informaCpf(usuario.cpf)
//   await loginActions.informaSenha(usuario.senha)
  
//   // temporário
//   await page.waitForTimeout(3000)
//   const codigo = await obterCodigo2FA()

//   await loginActions.informa2FA(codigo)

//   // Temporário
//   await page.waitForTimeout(2000)

//   expect(await loginActions.obterSaldo()).toHaveText('R$ 5.000,00')
  
// });
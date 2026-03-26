// ----------------------------------------------------------
// Requisições HTTP, Fetch e CRUD exibidos na TELA
// Aqui, vamos manter a simplicidade (sem frameworks) e mostrar
// Create/Read/Update/Delete na UI (User Interface - interface do usuário).
// IMPORTANTE: O JSONPlaceholder NÃO persiste os dados de verdade.
//            Por isso, além do fetch (para fins didáticos),
//            mantemos um "banco" local em memória (localUsers)
//            e também espelhamos no localStorage para sobreviver
//            a recarregamentos da página.
// ----------------------------------------------------------

// ------------------------------
// 1) "Configurações" da "API"
// ------------------------------
const API_URL = 'https://jsonplaceholder.typicode.com/users';
// Essa URL é apenas para fins didáticos. Ela aceita POST/PUT/DELETE,
// mas não grava nada de fato. Então nós:
//   - Enviamos as requisições com fetch (para mostrar o protocolo HTTP)
//   - Atualizamos um array local (localUsers) e salvamos no localStorage
//     para que a mudança apareça na tela e sobreviva a um F5.

// ------------------------------
// 2) Seleção de elementos do DOM
// ------------------------------
const form = document.getElementById('adminForm');
const responseMessage = document.getElementById('responseMessage');
const readBtn = document.getElementById('readBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

// ----------------------------------------------------------
// 3) "Banco" local: array em memória + persistência em localStorage
// ----------------------------------------------------------
// 3.1) Carrega do localStorage (se existir) ou usa array vazio
let localUsers = loadLocalUsers();

// 3.2) Função utilitária: salva o array no localStorage
function saveLocalUsers() {
  localStorage.setItem('usuarios_aula', JSON.stringify(localUsers));
}

// 3.3) Função utilitária: carrega do localStorage
function loadLocalUsers() {
  try {
    const raw = localStorage.getItem('usuarios_aula');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    // Se algo der errado ao parsear, volta um array vazio
    return [];
  }
}

// 3.4) Gera um novo ID local sequencial (robusto mesmo se apagarmos itens)
function generateLocalId() {
  const ids = localUsers.map(u => Number(u.id)).filter(Number.isFinite);
  const maxId = ids.length ? Math.max(...ids) : 0;
  return maxId + 1;
}

// 3.5) Gera uma data de cadastro atual formatada (DD/MM/YYYY)

function getCurrentDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  return `${day}/${month}/${year}`;
}

// ----------------------------------------------------------
// 4) Funções de UI (exibir mensagens/objetos na tela)
// ----------------------------------------------------------
// 4.1) Mostra mensagens padronizadas na área #responseMessage
//      type: "success" | "error" | "info"
function showMessage(type, html) {
  const colors = {
    success: 'green',
    error: 'red',
    info: 'gray'
  };
  responseMessage.innerHTML = `<div style="color:${colors[type] || 'black'}">${html}</div>`;
}

// 4.2) Renderiza uma lista de usuários (objeto simples: {id, name, email})
function renderUserList(users, titulo = 'Usuários') {
  if (!users || users.length === 0) {
    showMessage('info', 'Nenhum usuário cadastrado ainda.');
    return;
  }

  let html = `
    <h3>${titulo}</h3>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Data do Cadastro</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data de Nascimento</th>
          <th>Telefone</th>
          <th>E-mail</th>
          <th>Departamento</th>
          <th>Administrador</th>
          <th>Senha Padrão</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach(u => {
    html += `
      <tr>
        <td>${u.id}</td>
        <td>${escapeHtml(u.dataCadastro)}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.cpf)}</td>
        <td>${escapeHtml(u.birthDate)}</td>
        <td>${escapeHtml(u.phone)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.departamento)}</td>
        <td>${escapeHtml(u.administrador)}</td>
        <td>${escapeHtml(u.senhaPadrao)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  responseMessage.innerHTML = html;
}

// 4.3) Renderiza um único usuário (objeto) com destaque
function renderSingleUser(user, titulo = 'Usuário') {
  if (!user) {
    showMessage('info', 'Usuário não encontrado.');
    return;
  }
  responseMessage.innerHTML = `
    <h3>${titulo}</h3>
    <p>
      <strong>ID:</strong> ${user.id}<br>
      <strong>Data do Cadastro:</strong> ${user.dataCadastro}<br>
      <strong>Nome:</strong> ${escapeHtml(user.name)}<br>
      <strong>CPF:</strong> ${escapeHtml(user.cpf)}<br>
      <strong>Data de Nascimento:</strong> ${escapeHtml(user.birthDate)}<br>
      <strong>Telefone:</strong> ${escapeHtml(user.phone)}<br>
      <strong>E-mail:</strong> ${escapeHtml(user.email)}<br>
      <strong>Departamento:</strong> ${escapeHtml(user.departamento)}<br>
      <strong>Administrador:</strong> ${escapeHtml(user.administrador)}<br>
      <strong>Senha Padrão:</strong> ${escapeHtml(user.senhaPadrao)}<br>
    </p>
  `;
}

// 4.4) Pequena função de segurança para escapar HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ----------------------------------------------------------
// 5) CREATE (POST) - evento do formulário
// ----------------------------------------------------------
// Fluxo didático:
//   a) Pega os campos do form
//   b) Envia POST para a API (didático - não persiste de fato)
//   c) Cria/atualiza o "banco" local (localUsers + localStorage)
//   d) Mostra o usuário criado na tela
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // a) Coleta dados do formulário
  const name = document.getElementById('name').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const birthDate = document.getElementById('birthDate').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const departamento = document.getElementById('departamento').value.trim();
  const administrador = document.getElementById('administrador').value.trim();
  const senhaPadrao = document.getElementById('senhaPadrao').value.trim();


  // Validação simples para aula (HTML já tem required, mas reforçamos)
  if (!name || !cpf || !birthDate || !phone || !email || !departamento || !administrador || !senhaPadrao || !administrador) {
    showMessage('error', 'Preencha todos os campos.');
    return;
  }

  // Objeto a ser enviado
  const newUser = { name, cpf, birthDate, phone, email, departamento, administrador, senhaPadrao};

  try {
    // b) Envia POST (demonstração do protocolo HTTP)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error('Erro na requisição HTTP');

    const data = await response.json();
    // Como a API não persiste, garantimos um ID local nosso
    const createdUser = {
      id: data.id ?? generateLocalId(),
      ...newUser
    };

    // c) Atualiza o "banco" local e salva
    localUsers.push(createdUser);
    saveLocalUsers();

    // d) Mostra o resultado na tela
    renderSingleUser(createdUser, 'Usuário criado com sucesso!');
    form.reset();

  } catch (error) {
    showMessage('error', 'Erro ao cadastrar usuário.');
  }
});

// ----------------------------------------------------------
// 6) READ (GET) - ler SOMENTE os usuários cadastrados na aula
// ----------------------------------------------------------
// Fluxo didático:
//   - Não buscamos da API (pois ela traria exemplos prontos).
//   - Mostramos apenas o que está no nosso "banco" local.
readBtn.addEventListener('click', () => {
  renderUserList(localUsers, 'Usuários cadastrados');
});

// ----------------------------------------------------------
// 7) UPDATE (PUT) - atualiza UM usuário cadastrado localmente
// ----------------------------------------------------------
// Fluxo didático:
//   a) Pedir o ID via prompt (sem mexer no HTML)
//   b) Encontrar o usuário no "banco" local
//   c) Pedir novos valores (com preenchimento do atual)

updateBtn.addEventListener('click', async () => {
  const idStr = prompt('Digite o ID do usuário a atualizar:');
  if (idStr === null) return;
  const id = Number(idStr);

  if (!Number.isFinite(id) || id <= 0) {
    showMessage('error', 'ID inválido.');
    return;
  }

  const user = localUsers.find(u => Number(u.id) === id);
  if (!user) {
    showMessage('info', `Não encontrei usuário com ID ${id} no cadastro local.`);
    return;
  }

  const newName = prompt('Novo nome:', user.name);
  if (newName === null) return;
  const newCpf = prompt('Novo CPF:', user.cpf);
  if (newCpf === null) return;
  const newBirthDate = prompt('Nova data de nascimento:', user.birthDate);
  if (newBirthDate === null) return;
  const newPhone = prompt('Novo telefone:', user.phone);
  if (newPhone === null) return;
  const newEmail = prompt('Novo e-mail:', user.email);
  if (newEmail === null) return;
  const newDepartamento = prompt('Novo departamento:', user.departamento);
  if (newDepartamento === null) return;
  const newAdministrador = prompt('Novo administrador:', user.administrador);
  if (newAdministrador === null) return;
  const newSenhaPadrao = prompt('Nova senha padrão:', user.senhaPadrao);
  if (newSenhaPadrao === null) return;

  const updatedData = {
    name: newName.trim(),
    cpf: newCpf.trim(),
    birthDate: newBirthDate.trim(),
    phone: newPhone.trim(),
    email: newEmail.trim(),
    departamento: newDepartamento.trim(),
    administrador: newAdministrador.trim(),
    senhaPadrao: newSenhaPadrao.trim()
  };

  if (!updatedData.name || !updatedData.cpf || !updatedData.birthDate || !updatedData.phone || !updatedData.email || !updatedData.departamento || !updatedData.administrador || !updatedData.senhaPadrao) {
    showMessage('error', 'Todos os campos são obrigatórios.');
    return;
  }

  try {
    // Tentamos o PUT apenas para fins didáticos
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    // Mesmo se a API retornar erro (404, 500 etc.), continuamos localmente
    if (!response.ok) {
      console.warn(`A API retornou status ${response.status}, mas o usuário será atualizado localmente.`);
    }

    // Atualiza o "banco" local mesmo assim
    const idx = localUsers.findIndex(u => Number(u.id) === id);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...updatedData };
      saveLocalUsers();
      renderSingleUser(localUsers[idx], 'Usuário atualizado com sucesso (local)!');
    } else {
      showMessage('info', 'Usuário não está no cadastro local.');
    }
  } catch (error) {
    showMessage('error', 'Erro inesperado ao atualizar usuário.');
  }
});

// ----------------------------------------------------------
// 8) DELETE (DELETE) - remove UM usuário cadastrado localmente
// ----------------------------------------------------------
// Fluxo didático:
//   a) Pedir o ID via prompt
//   b) Confirmar exclusão
//   c) Enviar DELETE para a API (demonstração) e remover do local
//   d) Mostrar resultado e, opcionalmente, listar restante
deleteBtn.addEventListener('click', async () => {
  // a) ID
  const idStr = prompt('Digite o ID do usuário a deletar:');
  if (idStr === null) return; // cancelou
  const id = Number(idStr);

  if (!Number.isFinite(id) || id <= 0) {
    showMessage('error', 'ID inválido.');
    return;
  }

  // Verifica se existe no local
  const user = localUsers.find(u => Number(u.id) === id);
  if (!user) {
    showMessage('info', `Não encontrei usuário com ID ${id} no cadastro local.`);
    return;
  }

  // b) Confirmação
  const ok = confirm(`Tem certeza que deseja deletar o usuário "${user.name}" (ID ${id})?`);
  if (!ok) return;

  try {
    // c) Envia DELETE didático para a API
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao deletar na API.');

    // Remove do "banco" local e salva
    localUsers = localUsers.filter(u => Number(u.id) !== id);
    saveLocalUsers();

    // d) Mostra resultado
    showMessage('success', `Usuário com ID ${id} deletado (simulado e removido do cadastro local).`);

    // (Opcional) Mostrar lista remanescente
    // renderUserList(localUsers, 'Usuários restantes (local)');
  } catch (error) {
    showMessage('error', 'Erro ao deletar usuário.');
  }
});
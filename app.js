const STORAGE_KEY = 'csi-wires-mock';
const STORAGE_VERSION = '2';
const VERSION_KEY = 'csi-wires-mock-version';
const BANK_SENDER_ABA = '042102403';

const CURRENCY_LABELS = {
  USD: 'USD - US Dollar',
  EUR: 'EUR - Euro',
  GBP: 'GBP - Pound Sterling',
};

const SEEDS = [
  {
    id: '3179682',
    wireType: 'domestic',
    amount: '1.01',
    currency: 'USD',
    originatorName: '2026 Test Company',
    originatorAccount: '12345678',
    beneficiaryName: 'John Doe',
    beneficiaryAccount: '123456789',
    memberId: '042102403',
    purpose: '',
    reference: 'NOTPROVIDED',
    originatorAddress1: '99 Lancaster St',
    originatorAddress2: 'Stanford, KY 40484',
    beneficiaryAddress1: '99 Lancaster Street',
    beneficiaryAddress2: 'Stanford, KY 40484',
    createdAt: '9/28/2026 5:07:01 PM +00:00',
    uetr: 'da915416-5b71-42a5-a543-0e83d7a86137',
    status: 'Duplicate Wire Check Passed',
    seed: true,
  },
  {
    id: '3181001',
    wireType: 'domestic',
    amount: '2500.00',
    currency: 'USD',
    originatorName: 'Lancaster Hardware LLC',
    originatorAccount: '440019283',
    beneficiaryName: 'Maria Alvarez',
    beneficiaryAccount: '998877665',
    memberId: '021000021',
    purpose: 'Invoice 4412',
    reference: 'INV-4412',
    status: 'Pending Approval',
    seed: true,
  },
  {
    id: '3181002',
    wireType: 'domestic',
    amount: '750.50',
    currency: 'USD',
    originatorName: 'Bluegrass Payroll',
    originatorAccount: '550012345',
    beneficiaryName: 'Owen Blake',
    beneficiaryAccount: '112233445',
    memberId: '026009593',
    purpose: 'Payroll funding',
    reference: 'PR-2026-09',
    status: 'Entered',
    seed: true,
  },
  {
    id: '3181003',
    wireType: 'domestic',
    amount: '12000.00',
    currency: 'USD',
    originatorName: 'Stanford Medical Group',
    originatorAccount: '660078901',
    beneficiaryName: 'Priya Shah',
    beneficiaryAccount: '556677889',
    memberId: '121000248',
    purpose: 'Equipment purchase',
    reference: 'PO-8831',
    status: 'Duplicate Wire Check Passed',
    seed: true,
  },
  {
    id: '3182001',
    wireType: 'international',
    amount: '4800.00',
    currency: 'EUR',
    originatorName: '2026 Test Company',
    originatorAccount: '12345678',
    beneficiaryName: 'Helga Meier',
    beneficiaryAccount: 'DE89370400440532013000',
    memberId: 'DEUTDEFF',
    purpose: 'Consulting fee',
    reference: 'INV-DE-19',
    status: 'Entered',
    seed: true,
  },
];

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seedCopy() {
  return SEEDS.map((wire) => ({ ...wire }));
}

function loadWires() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null || localStorage.getItem(VERSION_KEY) !== STORAGE_VERSION) {
    const seeds = seedCopy();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    return seeds;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('expected a list');
    return parsed;
  } catch (error) {
    const seeds = seedCopy();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    return seeds;
  }
}

function saveWires(wires) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wires));
}

function findWire(id) {
  return loadWires().find((wire) => wire.id === id) || null;
}

function currencyLabel(code) {
  const upper = String(code || '').toUpperCase();
  return CURRENCY_LABELS[upper] || upper;
}

function typeLabel(wireType) {
  return wireType === 'international' ? 'International' : 'Domestic';
}

function toolbar(note, buttons) {
  return `
    <div class="mock-toolbar">
      <p>${esc(note)}</p>
      ${buttons}
    </div>
  `;
}

function shell(content) {
  return `
    <div class="csi-app">
      <aside class="csi-side">
        <div class="csi-logo">CSI</div>
        <nav>
          <a href="#/">Transfers</a>
          <a href="#/">Requests</a>
          <a href="#/">Broadcast Messages</a>
          <a class="is-current" href="#/">Browse</a>
          <a href="#/">Customer Profiles</a>
          <a href="#/">Reports</a>
          <a href="#/">Administration</a>
        </nav>
      </aside>
      <div class="csi-main">
        <header class="csi-top">
          <div class="csi-bank">First Southern National Bank - 312</div>
          <div class="csi-user">
            <span>Help</span>
            <span>Sign Out</span>
            <strong>Jacob Carter</strong>
          </div>
        </header>
        <div class="csi-content">${content}</div>
      </div>
    </div>
  `;
}

function renderQueue() {
  document.title = 'CSI Wire - Wires';
  const wires = loadWires();
  const rows = wires.map((wire) => `
    <tr>
      <td><a href="#/wires/${esc(encodeURIComponent(wire.id))}">${esc(wire.id)}</a></td>
      <td>${esc(wire.beneficiaryName)}</td>
      <td>${esc(wire.currency)} ${esc(wire.amount)}</td>
      <td>${esc(typeLabel(wire.wireType))}</td>
      <td>${esc(wire.status)}</td>
    </tr>
  `).join('');

  document.getElementById('app').innerHTML = toolbar('Mock queue. These controls are not part of a CSI wire view.', `
        <a class="button" href="#/wires/new">New wire</a>
        <button type="button" class="secondary" id="reset-seeds">Reset to seed data</button>
      `) + shell(`
      <h1>Wires</h1>
      <table class="queue">
        <thead>
          <tr>
            <th>Wire ID</th>
            <th>Beneficiary</th>
            <th>Amount</th>
            <th>Wire type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="5" class="empty">No wires.</td></tr>'}
        </tbody>
      </table>
  `);

  document.getElementById('reset-seeds').addEventListener('click', () => {
    if (!window.confirm('Restore the original five wires and remove wires you added?')) return;
    saveWires(seedCopy());
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    renderQueue();
  });
}

function fieldRow(label, value, valueId) {
  const idAttr = valueId ? ` id="${esc(valueId)}"` : '';
  return `
    <div class="form-row">
      <label>${esc(label)}</label>
      <div class="col col-form-label"${idAttr}>${esc(value)}</div>
    </div>
  `;
}

function renderDetail(id) {
  const wire = findWire(id);
  const app = document.getElementById('app');
  if (!wire) {
    document.title = 'CSI Wire';
    app.innerHTML = `
      <div class="bank-bar">First Southern National Bank - 312</div>
      <main class="page">
        <h1>Wire not found</h1>
        <p class="empty">No mock wire matches ${esc(id)}.</p>
        <a class="button secondary" href="#/">Back to wires</a>
      </main>
    `;
    return;
  }

  document.title = `CSI Wire - ${wire.id} View`;
  const international = wire.wireType === 'international';
  const clearing = international ? 'SWIFT' : 'USABA - US Routing Number';
  const receiverLabel = international ? 'SWIFT' : 'ABA';
  const deleteButton = wire.seed
    ? ''
    : '<button type="button" class="danger" id="delete-wire">Delete</button>';
  const identifierType = (useIban) => `
    <div class="form-row">
      <label>Identifier Type</label>
      <div class="checks">
        <label><input type="radio" disabled ${useIban ? 'checked' : ''}/> IBAN</label>
        <label><input type="radio" disabled ${useIban ? '' : 'checked'}/> Other</label>
      </div>
    </div>
  `;

  app.innerHTML = toolbar('Mock controls. They sit outside the wire view.', `
        <a class="button secondary" href="#/">Back to wires</a>
        <a class="button" href="#/wires/${esc(encodeURIComponent(wire.id))}/edit">Edit</a>
        ${deleteButton}
      `) + shell(`
      <div class="view-head">
        <h1><a href="#/">Wires/</a> ${esc(wire.id)} View</h1>
        <div class="badges">
          <span>Direction: Outbound</span>
          <span>Status: ${esc(wire.status)}</span>
          <span>Fees: $5.00</span>
        </div>
      </div>
      <section id="detail-cards">
        <article class="card">
          <div class="card-header card-header-tabs">
            <span class="card-title">Processing Options</span>
            <button type="button" class="csi-tab is-active" data-tab="general">General</button>
            <button type="button" class="csi-tab" data-tab="account">Account</button>
            <button type="button" class="csi-tab" data-tab="fees">Fees</button>
            <button type="button" class="csi-tab" data-tab="notifications">Notifications</button>
          </div>
          <div class="card-body" data-pane="general">
            ${fieldRow('Wire Type', typeLabel(wire.wireType), 'mock-wire-type')}
            ${fieldRow('Wire Source', 'Other')}
            ${fieldRow('Do Not Post', 'No')}
          </div>
          <div class="card-body" data-pane="account" hidden>
            ${fieldRow('Account Number', wire.originatorAccount)}
            ${fieldRow('Account Status', 'Valid')}
            ${fieldRow('Account Type', 'Checking')}
            ${fieldRow('Customer Type', 'Individual')}
            ${fieldRow('Settlement Endpoint Configuration', international ? 'SWIFT International' : 'FRB Domestic')}
          </div>
          <div class="card-body" data-pane="fees" hidden>
            ${fieldRow('Fee Description', international ? 'Wire Transfer Fee - International' : 'Wire Transfer Fee - Domestic Employee')}
            ${fieldRow('Fee Amount', '$5.00')}
            ${fieldRow('Waive Current Fee', 'No')}
          </div>
          <div class="card-body" data-pane="notifications" hidden>
            ${fieldRow('Enabled', 'No')}
            ${fieldRow('Notification Type', '')}
            ${fieldRow('When To Notify', '')}
          </div>
        </article>
        <article class="card">
          <div class="card-header">Primary Wire Information</div>
          <div class="card-body columns-3">
            <div>
              ${fieldRow('Business Function', 'CTRC - Core Customer Transfer')}
              ${fieldRow('Creation Date', wire.createdAt || '')}
              ${fieldRow('Settlement Date', '')}
              ${fieldRow('IMAD', '')}
              ${fieldRow('OMAD', '')}
            </div>
            <div>
              <span class="group-label">Amount</span>
              <div id="WireViewModel_MessageData_PrimaryWireInformation_InterbankSettlementAmount_Currency_Div">
                ${fieldRow('Currency Code', currencyLabel(wire.currency))}
              </div>
              <div id="WireViewModel_MessageData_PrimaryWireInformation_InterbankSettlementAmount_Div">
                ${fieldRow('Amount', wire.amount, 'WireViewModel_MessageData_PrimaryWireInformation_InterbankSettlementAmount_Amount_Div')}
              </div>
              ${fieldRow('Category Purpose', '')}
              <span class="group-label">Sender DI</span>
              ${fieldRow('ABA', BANK_SENDER_ABA)}
              ${fieldRow('Short Name', '')}
            </div>
            <div>
              ${fieldRow('Sender Reference', wire.id, 'WireViewModel_MessageData_PrimaryWireInformation_SenderReference_Div')}
              ${fieldRow('UETR', wire.uetr || '')}
              <span class="group-label">Receiver DI</span>
              ${fieldRow(receiverLabel, wire.memberId)}
              ${international ? '' : fieldRow('Short Name', '')}
            </div>
          </div>
        </article>
        <div class="pair">
          <article class="card">
            <div class="card-header">Originator</div>
            <div class="card-body">
              ${fieldRow('Name', wire.originatorName, 'WireViewModel_MessageData_Originator_Debtor_Name_Div')}
              <span class="group-label">Address</span>
              ${fieldRow('Address Line 1', wire.originatorAddress1 || '')}
              ${fieldRow('Address Line 2', wire.originatorAddress2 || '')}
              <span class="group-label">Identification</span>
              <div class="form-row">
                <label>Identification Type</label>
                <div class="checks">
                  <label><input type="radio" disabled /> Organization Identification</label>
                  <label><input type="radio" disabled /> Private Identification</label>
                </div>
              </div>
              <span class="group-label">Account</span>
              ${identifierType(false)}
              ${fieldRow('Identifier', wire.originatorAccount, 'WireViewModel_MessageData_Originator_DebtorAccount_Identifier_Div')}
              ${fieldRow('Scheme', 'USACCOUNT')}
            </div>
          </article>
          <article class="card">
            <div class="card-header">Beneficiary</div>
            <div class="card-body">
              ${fieldRow('Name', wire.beneficiaryName, 'WireViewModel_MessageData_Beneficiary_Creditor_Name_Div')}
              <span class="group-label">Address</span>
              ${fieldRow('Address Line 1', wire.beneficiaryAddress1 || '')}
              ${fieldRow('Address Line 2', wire.beneficiaryAddress2 || '')}
              <span class="group-label">Identification</span>
              <div class="form-row">
                <label>Identification Type</label>
                <div class="checks">
                  <label><input type="radio" disabled /> Organization Identification</label>
                  <label><input type="radio" disabled /> Private Identification</label>
                </div>
              </div>
              <span class="group-label">Account</span>
              ${identifierType(international)}
              ${fieldRow('Identifier', wire.beneficiaryAccount, 'WireViewModel_MessageData_Beneficiary_CreditorAccount_Identifier_Div')}
              ${international ? '' : fieldRow('Scheme', 'USACCOUNT')}
            </div>
          </article>
        </div>
        <article class="card">
          <div class="card-header">Payment Related Information</div>
          <div class="card-body" id="PaymentRelatedInformationBody">
            ${fieldRow('Purpose', wire.purpose)}
            ${fieldRow('Reference For Beneficiary', wire.reference, 'WireViewModel_MessageData_PaymentRelatedInformation_EndToEndIdentification_Div')}
          </div>
        </article>
        <article class="card">
          <div class="card-header">Institution Information</div>
          <div class="card-body pair">
            <div>
              <span class="group-label">Originator FI</span>
              ${fieldRow('Name', 'NOTPROVIDED')}
              ${fieldRow('Clearing System', 'USABA - US Routing Number')}
              ${fieldRow('Member ID', BANK_SENDER_ABA)}
            </div>
            <div>
              <span class="group-label">Beneficiary FI</span>
              <div id="WireViewModel_MessageData_InstitutionInformation_CreditorAgent_Agent_Div">
                ${fieldRow('Clearing System', clearing)}
                ${fieldRow('Member ID', wire.memberId)}
              </div>
            </div>
          </div>
        </article>
        <article class="card">
          <div class="card-header">Intermediary Institutions</div>
          <div class="card-body columns-3">
            <div>
              <span class="group-label">Intermediary FI 1</span>
              ${fieldRow('Name', '')}
              ${fieldRow('Member ID', '')}
            </div>
            <div>
              <span class="group-label">Intermediary FI 2</span>
              ${fieldRow('Name', '')}
              ${fieldRow('Member ID', '')}
            </div>
            <div>
              <span class="group-label">Intermediary FI 3</span>
              ${fieldRow('Name', '')}
              ${fieldRow('Member ID', '')}
            </div>
          </div>
        </article>
      </section>
  `);

  document.querySelectorAll('.csi-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      document.querySelectorAll('.csi-tab').forEach((item) => {
        item.classList.toggle('is-active', item === tab);
      });
      document.querySelectorAll('[data-pane]').forEach((pane) => {
        pane.hidden = pane.getAttribute('data-pane') !== name;
      });
    });
  });

  const deleteControl = document.getElementById('delete-wire');
  if (deleteControl) {
    deleteControl.addEventListener('click', () => {
      if (!window.confirm(`Delete wire ${wire.id}?`)) return;
      saveWires(loadWires().filter((item) => item.id !== wire.id));
      location.hash = '#/';
    });
  }
}

function inputRow(name, label, value, options) {
  const required = options.required ? 'required' : '';
  const readOnly = options.readOnly ? 'readonly' : '';
  return `
    <label for="${esc(name)}">${esc(label)}</label>
    <input id="${esc(name)}" name="${esc(name)}" value="${esc(value)}" ${required} ${readOnly} />
  `;
}

function renderEditor(id) {
  const existing = id ? findWire(id) : null;
  const app = document.getElementById('app');
  if (id && !existing) {
    document.title = 'CSI Wire';
    app.innerHTML = `
      <div class="bank-bar">First Southern National Bank - 312</div>
      <main class="page">
        <h1>Wire not found</h1>
        <a class="button secondary" href="#/">Back to wires</a>
      </main>
    `;
    return;
  }

  const wire = existing || {
    id: '',
    wireType: 'domestic',
    amount: '',
    currency: 'USD',
    originatorName: '',
    originatorAccount: '',
    beneficiaryName: '',
    beneficiaryAccount: '',
    memberId: '',
    purpose: '',
    reference: '',
  };
  document.title = existing ? `Edit wire ${existing.id}` : 'New wire';

  app.innerHTML = `
    <div class="bank-bar">First Southern National Bank - 312</div>
    <main class="page">
      ${toolbar('Mock editor. This form is not the CSI wire view.', `
        <a class="button secondary" href="${existing ? `#/wires/${esc(encodeURIComponent(existing.id))}` : '#/'}">Cancel</a>
      `)}
      <h1>${existing ? `Edit ${esc(existing.id)}` : 'New wire'}</h1>
      <form class="editor" id="wire-form">
        <div id="form-error"></div>
        ${inputRow('id', 'Wire ID', wire.id, { required: true })}
        <label for="wireType">Wire type</label>
        <select id="wireType" name="wireType">
          <option value="domestic" ${wire.wireType === 'domestic' ? 'selected' : ''}>Domestic</option>
          <option value="international" ${wire.wireType === 'international' ? 'selected' : ''}>International</option>
        </select>
        ${inputRow('amount', 'Amount', wire.amount, { required: true })}
        ${inputRow('currency', 'Currency', wire.currency, { required: true })}
        ${inputRow('originatorName', 'Originator name', wire.originatorName, {})}
        ${inputRow('originatorAccount', 'Originator account', wire.originatorAccount, {})}
        ${inputRow('beneficiaryName', 'Beneficiary name', wire.beneficiaryName, { required: true })}
        ${inputRow('beneficiaryAccount', 'Beneficiary account', wire.beneficiaryAccount, {})}
        ${inputRow('memberId', 'Destination routing number or SWIFT', wire.memberId, {})}
        ${inputRow('purpose', 'Purpose', wire.purpose, {})}
        ${inputRow('reference', 'Reference for beneficiary', wire.reference, {})}
        <div class="actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </main>
  `;

  document.getElementById('wire-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (name) => String(data.get(name) ?? '').trim();
    const fields = {
      id: read('id'),
      wireType: read('wireType') === 'international' ? 'international' : 'domestic',
      amount: read('amount'),
      currency: read('currency').toUpperCase(),
      originatorName: read('originatorName'),
      originatorAccount: read('originatorAccount'),
      beneficiaryName: read('beneficiaryName'),
      beneficiaryAccount: read('beneficiaryAccount'),
      memberId: read('memberId'),
      purpose: read('purpose'),
      reference: read('reference'),
    };
    const errors = [];
    if (!fields.id) errors.push('Wire ID is required.');
    if (!fields.amount) errors.push('Amount is required.');
    if (!fields.beneficiaryName) errors.push('Beneficiary name is required.');
    const duplicate = loadWires().some((item) => item.id === fields.id && (!existing || item.id !== existing.id));
    if (duplicate) errors.push('That wire ID is already in the queue.');
    const errorBox = document.getElementById('form-error');
    if (errors.length) {
      errorBox.innerHTML = `<div class="error">${errors.map(esc).join('<br>')}</div>`;
      return;
    }
    const record = {
      ...fields,
      status: existing ? existing.status : 'Entered',
      seed: existing ? existing.seed === true : false,
    };
    const wires = loadWires();
    const index = existing ? wires.findIndex((item) => item.id === existing.id) : -1;
    if (index >= 0) wires[index] = record;
    else wires.push(record);
    saveWires(wires);
    location.hash = `#/wires/${encodeURIComponent(record.id)}`;
  });
}

function route() {
  const hash = location.hash || '#/';
  if (hash === '#/wires/new') {
    renderEditor(null);
    return;
  }
  const edit = hash.match(/^#\/wires\/([^/]+)\/edit$/);
  if (edit) {
    renderEditor(decodeURIComponent(edit[1]));
    return;
  }
  const detail = hash.match(/^#\/wires\/([^/]+)$/);
  if (detail) {
    renderDetail(decodeURIComponent(detail[1]));
    return;
  }
  if (location.hash !== '#/') location.hash = '#/';
  else renderQueue();
}

window.addEventListener('hashchange', route);
route();

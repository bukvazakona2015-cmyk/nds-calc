const VAT_RATES = [
  { value: "22", label: "22%" },
  { value: "10", label: "10%" },
  { value: "7", label: "7%" },
  { value: "5", label: "5%" },
  { value: "0", label: "Без НДС" },
];

const items = document.querySelector("#items");
const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
});
const numberFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 3 });

function parseNumber(value) {
  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");
  if (normalized === "") return 0;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function createRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><label class="visually-hidden">Количество в штуках</label><input class="quantity" type="number" min="0" step="any" inputmode="decimal" placeholder="0" aria-label="Количество в штуках"></td>
    <td><label class="visually-hidden">Цена с НДС за штуку</label><input class="price" type="number" min="0" step="any" inputmode="decimal" placeholder="0,00" aria-label="Цена с НДС за штуку"></td>
    <td><label class="visually-hidden">Ставка НДС</label><select class="rate" aria-label="Ставка НДС">${VAT_RATES.map((rate) => `<option value="${rate.value}">${rate.label}</option>`).join("")}</select></td>
    <td class="result total">0,00 ₽</td>
    <td class="result vat">0,00 ₽</td>
    <td class="actions"><button class="remove-button" type="button" aria-label="Удалить строку" title="Удалить строку">×</button></td>
  `;
  items.append(row);
  updateTotals();
  row.querySelector(".quantity").focus();
}

function updateTotals() {
  let grandTotal = 0;
  let grandVat = 0;
  const rows = [...items.rows];

  for (const row of rows) {
    const quantity = parseNumber(row.querySelector(".quantity").value);
    const price = parseNumber(row.querySelector(".price").value);
    const rate = Number(row.querySelector(".rate").value);
    const total = quantity * price;
    // Цена введена с НДС, поэтому налог извлекается из общей суммы.
    const vat = rate === 0 ? 0 : total * rate / (100 + rate);

    row.querySelector(".total").textContent = currency.format(total);
    row.querySelector(".vat").textContent = currency.format(vat);
    grandTotal += total;
    grandVat += vat;
  }

  document.querySelector("#grand-total").textContent = currency.format(grandTotal);
  document.querySelector("#grand-vat").textContent = currency.format(grandVat);
  document.querySelector("#row-count").textContent = `Позиций: ${numberFormat.format(rows.length)}`;
}

document.querySelector("#add-row").addEventListener("click", createRow);
document.querySelector("#add-row-bottom").addEventListener("click", createRow);
items.addEventListener("input", updateTotals);
items.addEventListener("change", updateTotals);
items.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-button");
  if (!removeButton) return;
  removeButton.closest("tr").remove();
  updateTotals();
});

createRow();

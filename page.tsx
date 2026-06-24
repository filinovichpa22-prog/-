"use client";
import { useState } from "react";

type Status = "В очереди" | "В работе" | "Готово";

interface Module {
  name: string;
  w: number;
  h: number;
  d: number;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  client: string;
  date: string;
  comment: string;
  status: Status;
  modules: Module[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ЗК-041",
    client: "Иванова Марина",
    date: "13.05.2026",
    comment: "Кухня Л-образная, фасады МДФ белый глянец. Срок монтажа 15.05.",
    status: "В работе",
    modules: [
      { name: "Нижний шкаф 600",  w: 60,  h: 85,  d: 60, qty: 3, price: 320 },
      { name: "Верхний шкаф 600", w: 60,  h: 72,  d: 35, qty: 2, price: 280 },
      { name: "Шкаф с ящиками",   w: 60,  h: 85,  d: 60, qty: 1, price: 410 },
      { name: "Пенал 600",        w: 60,  h: 210, d: 60, qty: 1, price: 680 },
    ],
  },
  {
    id: "ЗК-039",
    client: "Петров Александр",
    date: "11.05.2026",
    comment: "Шкаф-купе в спальню, 3 секции. Зеркало на средней двери.",
    status: "Готово",
    modules: [
      { name: "Секция шкафа-купе", w: 100, h: 240, d: 65, qty: 3, price: 890 },
      { name: "Полка внутренняя",  w: 98,  h: 2,   d: 60, qty: 6, price: 85  },
    ],
  },
  {
    id: "ЗК-042",
    client: "Сидорова Елена",
    date: "13.05.2026",
    comment: "Столешница под мойку, постформинг. Вырез по шаблону клиента.",
    status: "В очереди",
    modules: [
      { name: "Столешница 2400", w: 240, h: 4, d: 60, qty: 1, price: 480 },
      { name: "Столешница 1200", w: 120, h: 4, d: 60, qty: 1, price: 260 },
    ],
  },
  {
    id: "ЗК-038",
    client: "Кузнецов Дмитрий",
    date: "10.05.2026",
    comment: "Кухня прямая 3м, фасады плёнка ПВХ орех. Встройка духовки и варочной.",
    status: "В очереди",
    modules: [
      { name: "Нижний шкаф 500",  w: 50, h: 85, d: 60, qty: 2, price: 290 },
      { name: "Нижний шкаф 600",  w: 60, h: 85, d: 60, qty: 2, price: 320 },
      { name: "Верхний шкаф 600", w: 60, h: 72, d: 35, qty: 4, price: 280 },
    ],
  },
];

// ── DXF generation ──────────────────────────────────────────────────────────

function buildDXF(order: Order): string {
  const out: string[] = [];
  const line = (...tokens: (string | number)[]) =>
    tokens.forEach((t) => out.push(String(t)));

  line("0", "SECTION", "2", "HEADER", "9", "$ACADVER", "1", "AC1009", "0", "ENDSEC");
  line("0", "SECTION", "2", "ENTITIES");

  let x = 0;
  for (const mod of order.modules) {
    for (let q = 0; q < mod.qty; q++) {
      const x0 = x, y0 = 0, x1 = x + mod.w, y1 = mod.d;

      // top-view rectangle: 4 LINE entities
      for (const [ax, ay, bx, by] of [
        [x0, y0, x1, y0],
        [x1, y0, x1, y1],
        [x1, y1, x0, y1],
        [x0, y1, x0, y0],
      ] as [number, number, number, number][]) {
        line("0", "LINE", "8", "0",
          "10", ax, "20", ay, "30", "0.0",
          "11", bx, "21", by, "31", "0.0");
      }

      // module name label
      line("0", "TEXT", "8", "0",
        "10", x0 + 2, "20", y0 + Math.max(mod.d * 0.65, 3), "30", "0.0",
        "40", "5.0", "1", mod.name);

      // dimension label
      line("0", "TEXT", "8", "0",
        "10", x0 + 2, "20", y0 + Math.max(mod.d * 0.25, 1), "30", "0.0",
        "40", "4.0", "1", `${mod.w}x${mod.h}x${mod.d} cm`);

      x += mod.w + 20;
    }
  }

  line("0", "ENDSEC", "0", "EOF");
  return out.join("\n");
}

function downloadDXF(order: Order) {
  const blob = new Blob([buildDXF(order)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `order-${order.id}-package.dxf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SIDEBAR_BADGE: Record<Status, string> = {
  "В очереди": "bg-gray-500/30 text-gray-300",
  "В работе":  "bg-orange-500/30 text-orange-300",
  "Готово":    "bg-green-500/30 text-green-300",
};

const DETAIL_BADGE: Record<Status, string> = {
  "В очереди": "bg-gray-100 text-gray-600",
  "В работе":  "bg-orange-100 text-orange-600",
  "Готово":    "bg-green-100 text-green-600",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function WorkshopPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_ORDERS[0].id);

  const selected = orders.find((o) => o.id === selectedId)!;
  const total = selected.modules.reduce((s, m) => s + m.price * m.qty, 0);

  const setStatus = (id: string, status: Status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-6 h-14 shrink-0 shadow-md"
        style={{ backgroundColor: "#1e3a5f" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">М</span>
          </div>
          <span className="text-white font-semibold text-sm">
            Панель мастера цеха
          </span>
          <span className="hidden sm:inline text-blue-300 text-xs ml-2 border-l border-white/20 pl-3">
            {today}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-xs hidden sm:inline">
            Цех №1 — Мебельное производство
          </span>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer">
            <span className="text-white text-xs font-semibold">МЦ</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className="w-72 shrink-0 flex flex-col overflow-hidden shadow-lg"
          style={{ backgroundColor: "#162d4a" }}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="text-white font-semibold text-sm">Очередь заказов</span>
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`w-full text-left px-4 py-3.5 transition-colors border-l-[3px] ${
                  selectedId === order.id
                    ? "bg-white/10 border-orange-500"
                    : "border-transparent hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-semibold">{order.id}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${SIDEBAR_BADGE[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-blue-200 text-xs font-medium">{order.client}</div>
                <div className="text-blue-400 text-xs mt-0.5">{order.date}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main area ────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">

            {/* Order info card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{selected.id}</h1>
                  <p className="text-gray-600 text-sm mt-0.5 font-medium">{selected.client}</p>
                  <p className="text-gray-400 text-xs mt-1">{selected.date}</p>
                </div>
                <span
                  className={`text-sm px-3 py-1.5 rounded-full font-semibold shrink-0 ${DETAIL_BADGE[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>

              {selected.comment && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">
                    Комментарий
                  </p>
                  <p className="text-sm text-gray-700">{selected.comment}</p>
                </div>
              )}
            </div>

            {/* Modules table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Состав заказа</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                        Модуль
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                        Ш × В × Г (см)
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                        Кол-во
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                        Цена, BYN
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                        Сумма, BYN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selected.modules.map((mod, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 text-sm text-gray-900 font-medium">
                          {mod.name}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 text-center font-mono">
                          {mod.w}&thinsp;×&thinsp;{mod.h}&thinsp;×&thinsp;{mod.d}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 text-center">
                          {mod.qty}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 text-right">
                          {mod.price.toLocaleString("ru-RU")}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-gray-900 font-semibold text-right">
                          {(mod.price * mod.qty).toLocaleString("ru-RU")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-sm font-bold text-gray-900 text-right"
                      >
                        ИТОГО
                      </td>
                      <td className="px-6 py-4 text-xl font-bold text-orange-500 text-right">
                        {total.toLocaleString("ru-RU")}&nbsp;BYN
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Управление заказом
              </h2>

              <div className="flex flex-wrap items-end gap-4">
                {/* Status selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Статус
                  </label>
                  <select
                    value={selected.status}
                    onChange={(e) => setStatus(selectedId, e.target.value as Status)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white transition-colors cursor-pointer"
                  >
                    <option>В очереди</option>
                    <option>В работе</option>
                    <option>Готово</option>
                  </select>
                </div>

                {/* DXF download */}
                <button
                  onClick={() => downloadDXF(selected)}
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-orange-400 text-gray-700 hover:text-orange-500 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Скачать DXF пакет
                </button>

                {/* Mark done */}
                <button
                  onClick={() => setStatus(selectedId, "Готово")}
                  disabled={selected.status === "Готово"}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Отметить выполненным
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

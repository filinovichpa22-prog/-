import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">К</span>
              </div>
              <span className="text-white font-bold text-lg">КухниПро</span>
            </div>
            <p className="text-sm text-gray-400">
              Мебельная фабрика полного цикла. Производство кухонь и мебели на заказ с 2010 года.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/constructor" className="hover:text-white transition-colors">3D-конструктор</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li>+375 (17) 123-45-67</li>
              <li>info@kukhni-pro.by</li>
              <li>г. Минск, ул. Промышленная, 14</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          © 2026 КухниПро. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

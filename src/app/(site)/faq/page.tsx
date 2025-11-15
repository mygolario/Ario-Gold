const faqs = [
  {
    question: "چگونه خرید طلا در آریو تضمین می‌شود؟",
    answer:
      "هر سفارش با طلای فیزیکی معادل در خزانه بیمه‌شده پشتیبانی می‌شود و امکان تحویل سکه یا آب‌شده وجود دارد.",
  },
  {
    question: "مدت زمان بررسی KYC چقدر است؟",
    answer: "در ساعات اداری بین ۳۰ دقیقه تا ۲ ساعت؛ برای کاربران VIP کمتر از ۱۵ دقیقه.",
  },
  {
    question: "کارمزد خرید و فروش چگونه محاسبه می‌شود؟",
    answer: "کارمزد ثابت ۰.۲٪ بر مبلغ تراکنش اعمال شده و در صفحه خرید/فروش به صورت شفاف نمایش داده می‌شود.",
  },
  {
    question: "آیا امکان لغو سفارش وجود دارد؟",
    answer: "تا زمانی که سفارش در وضعیت CREATED یا PENDING_PAYMENT باشد، می‌توانید از طریق پشتیبانی لغو کنید.",
  },
]

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16" dir="rtl">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">سوالات متداول</h1>
        <p className="text-slate-600">
          سوالات پرتکرار مشتریان را اینجا مرور کنید یا از پشتیبانی ۲۴ ساعته کمک بگیرید.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <summary className="cursor-pointer text-lg font-semibold text-slate-900">{faq.question}</summary>
            <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

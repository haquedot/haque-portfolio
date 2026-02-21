import React from "react"

export default function ShippingPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>

      <p className="mb-4">Last updated: January 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Applicability</h2>
        <p>
          This website primarily offers digital services and content. No
          physical goods are shipped from <strong>merajulhaque.com</strong>.
          Therefore, shipping charges, delivery windows, and related
          logistical policies are not applicable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Questions</h2>
        <p>
          If you believe shipping should apply to a particular purchase,
          please contact us at <a href="mailto:haquedot@gmail.com" className="underline text-primary">haquedot@gmail.com</a>.
        </p>
      </section>
    </main>
  )
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { useCart } from "@/components/cart/cart-context";
import { formatINRFromCents } from "@/lib/money";

export default function CheckoutPage(): React.ReactNode {
  const router = useRouter();
  const cart = useCart();
  const { items, subtotalCents, clear, itemCount, removeItem, setQuantity } = cart;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"processing" | "success" | "failed">("processing");

  const canSubmit = useMemo(() => {
    return itemCount > 0 && user && email.trim().includes("@");
  }, [email, itemCount, user]);

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setEmail(data.user.email);
        } else {
          // Redirect to login with return URL
          router.push(`/auth/login?returnTo=${encodeURIComponent("/checkout")}`);
        }
      })
      .catch(() => {
        router.push(`/auth/login?returnTo=${encodeURIComponent("/checkout")}`);
      });

    // Fetch products for order summary
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error);
  }, [router]);

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    
    // Show payment modal instead of processing immediately
    setShowPaymentModal(true);
    setPaymentStep("processing");
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Create the order after "payment" is processed
        const orderItems = items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) throw new Error(`Product ${item.productId} not found`);
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitCents: product.priceCents,
          };
        });

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderItems }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create order");
        }

        setPaymentStep("success");
        clear();
        
        // Redirect after showing success
        setTimeout(() => {
          router.push("/orders?placed=1");
        }, 2000);
        
      } catch (e) {
        setPaymentStep("failed");
        setError((e as Error).message);
      } finally {
        setIsSubmitting(false);
      }
    }, 3000); // 3 second payment simulation
  };

  const cartItemsWithDetails = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
      total: product ? product.priceCents * item.quantity : 0,
    };
  });

  // Calculate real subtotal from fetched products
  const realSubtotalCents = useMemo(() => {
    return cartItemsWithDetails.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);
  }, [cartItemsWithDetails]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      removeItem(productId);
    } else {
      // Update quantity
      setQuantity(productId, newQuantity);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-1 text-muted-foreground">
            Complete your order. Payments will be connected in the next step.
          </p>
        </div>
        <Link
          href="/cart"
          className="text-sm font-semibold text-foreground/80 hover:text-foreground"
        >
          Back to cart
        </Link>
      </div>

      {itemCount === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="text-lg font-semibold">Nothing to checkout</div>
          <div className="mt-1 text-muted-foreground">
            Add items to your cart first.
          </div>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Order summary ({itemCount} items)</div>
                <Link
                  href="/cart"
                  className="text-sm text-primary hover:underline"
                >
                  Edit cart
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.productId} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.product?.title?.charAt(0) || "P"}
                      </span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.title || "Product"}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.product?.description || "Digital product"}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-muted-foreground">Qty:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-border bg-background text-sm hover:bg-muted"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-border bg-background text-sm hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatINRFromCents(item.total)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatINRFromCents(item.product?.priceCents || 0)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-sm font-semibold">Customer details</div>

              <div className="mt-4 grid gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="mt-1 font-medium">{user.name}</div>
                </div>
                
                <label className="grid gap-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                {/* Payment Method Selection */}
                <div className="grid gap-2">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">UPI</div>
                        <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="payment"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Digital Wallet</div>
                        <div className="text-sm text-muted-foreground">Paytm Wallet, Amazon Pay</div>
                      </div>
                    </label>
                  </div>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm text-muted-foreground">Coupon Code</span>
                  <input
                    placeholder="(optional)"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="rounded-2xl border border-amber-500/20 bg-amber-50 p-4 text-sm text-amber-700">
                  <div className="font-medium">Demo Mode</div>
                  <div>Payment processing will be connected in the next phase. Orders are placed in demo mode for testing.</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold">Order Total</div>
            
            {/* Price Breakdown */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span>{formatINRFromCents(realSubtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>Included</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-semibold">{formatINRFromCents(realSubtotalCents)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Processing..." : `Pay ${formatINRFromCents(realSubtotalCents)} with ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Wallet'}`}
            </button>

            <div className="mt-4 text-xs text-muted-foreground">
              <div className="mb-2">• Digital products delivered instantly</div>
              <div className="mb-2">• Secure payment processing</div>
              <div>• 30-day money-back guarantee</div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Payment Info</div>
              <div>Payment gateway integration will be added in the next step. For now, orders are placed in demo mode.</div>
            </div>
          </aside>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            {paymentStep === "processing" && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-muted-foreground mb-4">
                  {paymentMethod === 'card' ? 'Securing your card payment...' : 
                   paymentMethod === 'upi' ? 'Initiating UPI payment...' : 
                   'Processing wallet payment...'}
                </p>
                <div className="text-sm text-muted-foreground">
                  Please wait while we process your payment securely.
                </div>
              </div>
            )}
            
            {paymentStep === "success" && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground mb-4">
                  Your order has been placed successfully.
                </p>
                <div className="text-sm text-muted-foreground">
                  Redirecting to your orders...
                </div>
              </div>
            )}
            
            {paymentStep === "failed" && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
                <p className="text-muted-foreground mb-4">
                  {error || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentStep("processing");
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

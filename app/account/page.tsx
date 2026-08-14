"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  Bell,
  Globe,
} from "lucide-react";

import { Header, Footer } from "../components";

type Section =
  | "overview"
  | "personal"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payments"
  | "settings";

type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work";
};

type Payment = {
  id: number;
  type: "Visa" | "Mastercard" | "UPI";
  last4: string;
  label: string;
};

const demoOrders = [
  {
    id: "#SK10284",
    date: "14 Aug 2026",
    products: "Essential Cotton T-Shirt",
    total: 639,
    status: "Delivered",
  },
  {
    id: "#SK10251",
    date: "08 Aug 2026",
    products: "Straight Fit Jeans, Oxford Cotton Shirt",
    total: 2898,
    status: "Shipped",
  },
  {
    id: "#SK10197",
    date: "28 Jul 2026",
    products: "Relaxed Tailored Trousers",
    total: 1999,
    status: "Delivered",
  },
];

const defaultAddresses: Address[] = [
  {
    id: 1,
    name: "Sanket Kamboj",
    phone: "7009252303",
    address: "Main Market",
    city: "Jalalabad",
    state: "Punjab",
    pincode: "152024",
    type: "Home",
  },
];

const defaultPayments: Payment[] = [
  {
    id: 1,
    type: "Visa",
    last4: "4242",
    label: "Personal Card",
  },
];

export default function AccountPage() {
  const [activeSection, setActiveSection] =
    useState<Section>("overview");

  const [user, setUser] = useState({
    firstName: "Sanket",
    lastName: "Kamboj",
    email: "sanketkamboj1313@gmail.com",
    phone: "7009252303",
  });

  const [addresses, setAddresses] =
    useState<Address[]>(defaultAddresses);

  const [payments, setPayments] =
    useState<Payment[]>(defaultPayments);

  const [addressModal, setAddressModal] =
    useState(false);

  const [paymentModal, setPaymentModal] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [savedMessage, setSavedMessage] =
    useState("");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [orderUpdates, setOrderUpdates] =
    useState(true);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("sk-account-user");
    const savedAddresses =
      localStorage.getItem("sk-account-addresses");
    const savedPayments =
      localStorage.getItem("sk-account-payments");
    const savedDarkMode =
      localStorage.getItem("sk-dark-mode") === "true";
    const savedEmailNotifications =
      localStorage.getItem("sk-email-notifications");
    const savedOrderUpdates =
      localStorage.getItem("sk-order-updates");

    try {
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
    } catch {
      // Keep demo defaults if localStorage contains invalid JSON.
    }

    setDarkMode(savedDarkMode);

    if (savedEmailNotifications !== null) {
      setEmailNotifications(savedEmailNotifications === "true");
    }

    if (savedOrderUpdates !== null) {
      setOrderUpdates(savedOrderUpdates === "true");
    }

   if (savedDarkMode) {
  document.documentElement.classList.add("dark-mode");
  document.body.classList.add("dark-mode");
} else {
  document.documentElement.classList.remove("dark-mode");
  document.body.classList.remove("dark-mode");
}
  }, []);

  const showSaved = (message: string) => {
    setSavedMessage(message);

    window.setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  const saveUser = () => {
    localStorage.setItem(
      "sk-account-user",
      JSON.stringify(user)
    );
    showSaved("Personal information saved");
  };

  const saveAddresses = (items: Address[]) => {
    setAddresses(items);
    localStorage.setItem(
      "sk-account-addresses",
      JSON.stringify(items)
    );
  };

  const savePayments = (items: Payment[]) => {
    setPayments(items);
    localStorage.setItem(
      "sk-account-payments",
      JSON.stringify(items)
    );
  };

  const deleteAddress = (id: number) => {
    saveAddresses(
      addresses.filter((address) => address.id !== id)
    );
    showSaved("Address removed");
  };

  const deletePayment = (id: number) => {
    savePayments(
      payments.filter((payment) => payment.id !== id)
    );
    showSaved("Payment method removed");
  };

  const toggleDarkMode = () => {
  const nextMode = !darkMode;

  setDarkMode(nextMode);

  localStorage.setItem(
    "sk-dark-mode",
    String(nextMode)
  );

  document.documentElement.classList.toggle(
    "dark-mode",
    nextMode
  );

  document.body.classList.toggle(
    "dark-mode",
    nextMode
  );

  showSaved(
    nextMode
      ? "Dark mode enabled"
      : "Dark mode disabled"
  );
};

  const toggleEmailNotifications = () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    localStorage.setItem("sk-email-notifications", String(next));
    showSaved(
      next
        ? "Email notifications enabled"
        : "Email notifications disabled"
    );
  };

  const toggleOrderUpdates = () => {
    const next = !orderUpdates;
    setOrderUpdates(next);
    localStorage.setItem("sk-order-updates", String(next));
    showSaved(
      next ? "Order updates enabled" : "Order updates disabled"
    );
  };

  const menu: Array<{
    id: Section;
    label: string;
    icon: typeof User;
  }> = [
    { id: "overview", label: "Overview", icon: User },
    {
      id: "personal",
      label: "Personal Information",
      icon: User,
    },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    {
      id: "payments",
      label: "Payment Methods",
      icon: CreditCard,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <Header />

      <main className="account-page">
        <section className="account-hero">
          <div>
            <p className="eyebrow">S.K / ACCOUNT</p>

            <h1>
              MY
              <br />
              ACCOUNT
            </h1>

            <p className="account-welcome">
              Welcome back, {user.firstName}.
            </p>
          </div>

          <div className="account-profile">
            <div className="profile-avatar">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>

            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>{user.email}</span>
            </div>
          </div>
        </section>

        <section className="account-layout">
          <aside className="account-sidebar">
            <div className="account-nav-title">
              ACCOUNT
            </div>

            <nav>
              {menu.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      activeSection === item.id
                        ? "account-nav active"
                        : "account-nav"
                    }
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    <ChevronRight
                      size={15}
                      className="nav-arrow"
                    />
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="logout-button"
              onClick={() =>
                showSaved("Demo logout completed")
              }
            >
              <LogOut size={16} />
              SIGN OUT
            </button>
          </aside>

          <div className="account-content">
            {savedMessage && (
              <div className="account-toast">
                <Check size={17} />
                {savedMessage}
              </div>
            )}

            {activeSection === "overview" && (
              <Overview
                user={user}
                orders={demoOrders}
                addressCount={addresses.length}
                paymentCount={payments.length}
                setActiveSection={setActiveSection}
              />
            )}

            {activeSection === "personal" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="PROFILE"
                  title="PERSONAL INFORMATION"
                  description="Manage your contact information."
                />

                <div className="account-form-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label>FIRST NAME</label>
                      <input
                        value={user.firstName}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>LAST NAME</label>
                      <input
                        value={user.lastName}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>PHONE NUMBER</label>
                      <input
                        value={user.phone}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="account-primary-btn"
                    onClick={saveUser}
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </section>
            )}

            {activeSection === "orders" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="ORDERS"
                  title="MY ORDERS"
                  description="Track and manage your recent purchases."
                />

                <div className="orders-list">
                  {demoOrders.map((order) => (
                    <div
                      className="order-card"
                      key={order.id}
                    >
                      <div className="order-icon">
                        <Package size={21} />
                      </div>

                      <div className="order-main">
                        <div className="order-top">
                          <strong>{order.id}</strong>

                          <span
                            className={`order-status ${order.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <p>{order.products}</p>
                        <small>{order.date}</small>
                      </div>

                      <div className="order-total">
                        <span>TOTAL</span>

                        <strong>
                          ₹{order.total.toLocaleString("en-IN")}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            showSaved(
                              `Order ${order.id} selected`
                            )
                          }
                        >
                          VIEW ORDER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "wishlist" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="SAVED ITEMS"
                  title="WISHLIST"
                  description="Products you've saved for later."
                />

                <div className="feature-empty">
                  <Heart size={35} strokeWidth={1.2} />
                  <h3>YOUR WISHLIST</h3>
                  <p>
                    Your saved products will appear here.
                  </p>

                  <Link
                    href="/shop"
                    className="account-primary-btn"
                  >
                    EXPLORE PRODUCTS
                  </Link>
                </div>
              </section>
            )}

            {activeSection === "addresses" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="DELIVERY"
                  title="ADDRESSES"
                  description="Manage your saved delivery addresses."
                  action={
                    <button
                      type="button"
                      className="account-outline-btn"
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressModal(true);
                      }}
                    >
                      <Plus size={16} />
                      ADD ADDRESS
                    </button>
                  }
                />

                <div className="address-grid">
                  {addresses.length === 0 ? (
                    <div className="feature-empty">
                      <MapPin size={35} strokeWidth={1.2} />
                      <h3>NO ADDRESSES</h3>
                      <p>
                        Add a delivery address to make checkout
                        faster.
                      </p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div
                        className="address-card"
                        key={address.id}
                      >
                        <div className="address-card-top">
                          <span className="address-type">
                            {address.type}
                          </span>

                          <div>
                            <button
                              type="button"
                              aria-label="Edit address"
                              onClick={() => {
                                setEditingAddress(address);
                                setAddressModal(true);
                              }}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              aria-label="Delete address"
                              onClick={() =>
                                deleteAddress(address.id)
                              }
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <strong>{address.name}</strong>
                        <p>{address.address}</p>
                        <p>
                          {address.city}, {address.state}
                        </p>
                        <p>{address.pincode}</p>
                        <p>+91 {address.phone}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeSection === "payments" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="PAYMENTS"
                  title="PAYMENT METHODS"
                  description="Manage your saved payment methods."
                  action={
                    <button
                      type="button"
                      className="account-outline-btn"
                      onClick={() => setPaymentModal(true)}
                    >
                      <Plus size={16} />
                      ADD PAYMENT
                    </button>
                  }
                />

                <div className="payment-list">
                  {payments.length === 0 ? (
                    <div className="feature-empty">
                      <CreditCard
                        size={35}
                        strokeWidth={1.2}
                      />
                      <h3>NO PAYMENT METHODS</h3>
                      <p>
                        Add a demo payment method for this
                        portfolio project.
                      </p>
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <div
                        className="payment-card"
                        key={payment.id}
                      >
                        <div className="payment-brand">
                          <CreditCard size={23} />
                        </div>

                        <div>
                          <strong>
                            {payment.type} ••••{" "}
                            {payment.last4}
                          </strong>
                          <span>{payment.label}</span>
                        </div>

                        <button
                          type="button"
                          className="delete-icon"
                          aria-label="Delete payment method"
                          onClick={() =>
                            deletePayment(payment.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="payment-note">
                  <ShieldCheck size={18} />
                  <span>
                    Payment information is securely protected.
                    This portfolio project uses demo payment
                    data.
                  </span>
                </div>
              </section>
            )}

            {activeSection === "settings" && (
              <section className="account-section">
                <SectionHeading
                  eyebrow="PREFERENCES"
                  title="SETTINGS"
                  description="Control your S.K account preferences."
                />

                <div className="settings-card">
                  <SettingRow
                    icon={<Bell size={19} />}
                    title="Email notifications"
                    description="Receive news, offers and product updates."
                    enabled={emailNotifications}
                    onChange={toggleEmailNotifications}
                  />

                  <SettingRow
                    icon={<Package size={19} />}
                    title="Order updates"
                    description="Get notifications about your orders."
                    enabled={orderUpdates}
                    onChange={toggleOrderUpdates}
                  />

                  <SettingRow
                    icon={<Globe size={19} />}
                    title="India / INR"
                    description="Your store region and currency."
                    enabled={true}
                    onChange={() =>
                      showSaved("India / INR selected")
                    }
                  />

                  <SettingRow
                    icon={<Settings size={19} />}
                    title="Dark mode"
                    description="Use a darker interface."
                    enabled={darkMode}
                    onChange={toggleDarkMode}
                  />
                </div>

                <div className="danger-zone">
                  <div>
                    <strong>DELETE ACCOUNT</strong>
                    <p>
                      Permanently remove your demo account
                      data.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showSaved(
                        "Demo account deletion requested"
                      )
                    }
                  >
                    DELETE
                  </button>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      {addressModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => setAddressModal(false)}
          onSave={(address) => {
            if (editingAddress) {
              saveAddresses(
                addresses.map((item) =>
                  item.id === address.id ? address : item
                )
              );
            } else {
              saveAddresses([...addresses, address]);
            }

            setAddressModal(false);
            showSaved("Address saved");
          }}
        />
      )}

      {paymentModal && (
        <PaymentModal
          onClose={() => setPaymentModal(false)}
          onSave={(payment: Payment) => {
            savePayments([...payments, payment]);
            setPaymentModal(false);
            showSaved("Payment method added");
          }}
        />
      )}

      <Footer />
    </>
  );
}

function Overview({
  user,
  orders,
  addressCount,
  paymentCount,
  setActiveSection,
}: {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  orders: typeof demoOrders;
  addressCount: number;
  paymentCount: number;
  setActiveSection: (section: Section) => void;
}) {
  return (
    <section className="account-section">
      <SectionHeading
        eyebrow="DASHBOARD"
        title="ACCOUNT OVERVIEW"
        description={`Good to see you, ${user.firstName}. Here's your S.K account at a glance.`}
      />

      <div className="account-stat-grid">
        <button
          type="button"
          onClick={() => setActiveSection("orders")}
          className="account-stat"
        >
          <Package size={22} />
          <span>ORDERS</span>
          <strong>{orders.length}</strong>
          <small>View order history →</small>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("wishlist")}
          className="account-stat"
        >
          <Heart size={22} />
          <span>WISHLIST</span>
          <strong>0</strong>
          <small>Saved products →</small>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("addresses")}
          className="account-stat"
        >
          <MapPin size={22} />
          <span>ADDRESSES</span>
          <strong>{addressCount}</strong>
          <small>Manage addresses →</small>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("payments")}
          className="account-stat"
        >
          <CreditCard size={22} />
          <span>PAYMENTS</span>
          <strong>{paymentCount}</strong>
          <small>Manage payments →</small>
        </button>
      </div>

      <div className="account-lower-grid">
        <div className="account-panel">
          <div className="panel-heading">
            <div>
              <span>RECENT ACTIVITY</span>
              <h3>Latest Order</h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection("orders")}
            >
              VIEW ALL
            </button>
          </div>

          <div className="mini-order">
            <div className="mini-order-icon">
              <ShoppingBag size={20} />
            </div>

            <div>
              <strong>{orders[0].id}</strong>
              <p>{orders[0].products}</p>
            </div>

            <span className="order-status delivered">
              {orders[0].status}
            </span>
          </div>
        </div>

        <div className="account-panel profile-panel">
          <span>PROFILE COMPLETION</span>

          <div className="profile-progress">
            <div />
          </div>

          <strong>80% COMPLETE</strong>

          <p>
            Add another address or payment method to complete
            your account.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="account-section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {action}
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="setting-row">
      <div className="setting-icon">{icon}</div>

      <div className="setting-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={enabled ? "switch active" : "switch"}
        onClick={onChange}
        aria-label={title}
        aria-pressed={enabled}
      >
        <span />
      </button>
    </div>
  );
}

function AddressModal({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}) {
  const [form, setForm] = useState<Address>(
    address || {
      id: Date.now(),
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home",
    }
  );

  return (
    <div className="modal-overlay">
      <div className="account-modal">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="eyebrow">DELIVERY</p>

        <h2>
          {address ? "EDIT ADDRESS" : "ADD ADDRESS"}
        </h2>

        <div className="form-grid">
          <div className="form-field">
            <label>FULL NAME</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <label>PHONE</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field full">
            <label>ADDRESS</label>
            <input
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <label>CITY</label>
            <input
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <label>STATE</label>
            <input
              value={form.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  state: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <label>PINCODE</label>
            <input
              value={form.pincode}
              onChange={(e) =>
                setForm({
                  ...form,
                  pincode: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <label>ADDRESS TYPE</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "Home" | "Work",
                })
              }
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="account-primary-btn full-width"
          onClick={() => onSave(form)}
        >
          SAVE ADDRESS
        </button>
      </div>
    </div>
  );
}

function PaymentModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payment: Payment) => void;
}) {
  const [type, setType] =
    useState<Payment["type"]>("Visa");

  const [last4, setLast4] = useState("");
  const [label, setLabel] = useState("Personal Card");

  return (
    <div className="modal-overlay">
      <div className="account-modal">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="eyebrow">PAYMENT</p>

        <h2>ADD PAYMENT METHOD</h2>

        <div className="form-field">
          <label>PAYMENT TYPE</label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as Payment["type"])
            }
          >
            <option value="Visa">Visa</option>
            <option value="Mastercard">
              Mastercard
            </option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="form-field">
          <label>LAST 4 DIGITS</label>

          <input
            maxLength={4}
            inputMode="numeric"
            value={last4}
            placeholder="4242"
            onChange={(e) =>
              setLast4(
                e.target.value.replace(/\D/g, "")
              )
            }
          />
        </div>

        <div className="form-field">
          <label>LABEL</label>

          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="account-primary-btn full-width"
          onClick={() => {
            if (last4.length !== 4) {
              return;
            }

            onSave({
              id: Date.now(),
              type,
              last4,
              label,
            });
          }}
        >
          SAVE PAYMENT METHOD
        </button>
      </div>
    </div>
  );
}
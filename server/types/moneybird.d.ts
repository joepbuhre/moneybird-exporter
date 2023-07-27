export type sales_invoices = sales_invoice[]

export interface sales_invoice {
  id: string
  administration_id: string
  contact_id: string
  contact: Contact
  contact_person_id?: string
  contact_person?: ContactPerson
  invoice_id: string
  recurring_sales_invoice_id: any
  workflow_id: string
  document_style_id: string
  identity_id: string
  draft_id: any
  state: string
  invoice_date: string
  due_date: string
  payment_conditions: string
  payment_reference: string
  short_payment_reference: string
  reference: string
  language: string
  currency: string
  discount?: string
  original_sales_invoice_id?: string
  paused: boolean
  paid_at?: string
  sent_at: string
  created_at: string
  updated_at: string
  public_view_code: string
  public_view_code_expires_at: string
  version: number
  details: Detail[]
  payments: Payment[]
  total_paid: string
  total_unpaid: string
  total_unpaid_base: string
  prices_are_incl_tax: boolean
  total_price_excl_tax: string
  total_price_excl_tax_base: string
  total_price_incl_tax: string
  total_price_incl_tax_base: string
  total_discount: string
  marked_dubious_on: any
  marked_uncollectible_on: any
  reminder_count: number
  next_reminder: string
  original_estimate_id?: string
  url: string
  payment_url: string
  custom_fields: any[]
  notes: any[]
  attachments: any[]
  events: Event[]
  tax_totals: TaxTotal[]
}

export interface Contact {
  id: string
  administration_id: string
  company_name: string
  firstname?: string
  lastname?: string
  address1: string
  address2: string
  zipcode: string
  city: string
  country: string
  phone: string
  delivery_method: string
  customer_id: string
  tax_number: string
  chamber_of_commerce: string
  bank_account: string
  attention: string
  email: string
  email_ubl: boolean
  send_invoices_to_attention: string
  send_invoices_to_email: string
  send_estimates_to_attention: string
  send_estimates_to_email: string
  sepa_active: boolean
  sepa_iban: string
  sepa_iban_account_name: string
  sepa_bic: string
  sepa_mandate_id: string
  sepa_mandate_date: any
  sepa_sequence_type: string
  credit_card_number: string
  credit_card_reference: string
  credit_card_type: any
  tax_number_validated_at?: string
  tax_number_valid?: boolean
  invoice_workflow_id: any
  estimate_workflow_id: any
  si_identifier: string
  si_identifier_type: any
  moneybird_payments_mandate: boolean
  created_at: string
  updated_at: string
  version: number
  sales_invoices_url: string
  notes: any[]
  custom_fields: CustomField[]
  contact_people: any[]
  archived: boolean
}

export interface CustomField {
  id: string
  name: string
  value: string
}

export interface ContactPerson {
  id: any
  contact_id: string
  administration_id: string
  firstname: string
  lastname: string
  phone: any
  email: any
  department: any
  created_at: string
  updated_at: string
  version: number
}

export interface Detail {
  id: string
  administration_id: string
  tax_rate_id: string
  ledger_account_id: string
  project_id: any
  product_id: any
  amount: string
  amount_decimal: string
  description: string
  price: string
  period?: string
  row_order: number
  total_price_excl_tax_with_discount: string
  total_price_excl_tax_with_discount_base: string
  tax_report_reference: string[]
  mandatory_tax_text?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  administration_id: string
  invoice_type: string
  invoice_id: string
  financial_account_id: string
  user_id: string
  payment_transaction_id: any
  transaction_identifier: any
  price: string
  price_base: string
  payment_date: string
  credit_invoice_id: any
  financial_mutation_id: string
  ledger_account_id: string
  linked_payment_id: any
  manual_payment_action: any
  created_at: string
  updated_at: string
}

export interface Event {
  administration_id: string
  user_id: string
  action: string
  link_entity_id: any
  link_entity_type: any
  data: Data
  created_at: string
  updated_at: string
}

export interface Data {
  email_address?: string
  email_message?: string
  original_invoice?: string
  original_estimate?: string
}

export interface TaxTotal {
  tax_rate_id: string
  taxable_amount: string
  taxable_amount_base: string
  tax_amount: string
  tax_amount_base: string
}


// Filter possibilities
type SalesInvoiceState = "all" | "draft" | "open" | "scheduled" | "pending_payment" | "late" | "reminded" | "paid" | "uncollectible"
type SalesInvoiceDateName = "this_month" | "prev_month" | "next_month" | "this_quarter" | "prev_quarter" | "next_quarter" | "this_year" | "prev_year" | "next_year"
type SalesInvoiceDateValue = number // Dates

// Custom types
export interface moneybirdFilter {
  state: SalesInvoiceState[]
  period: SalesInvoiceDateName[] | SalesInvoiceDateValue[]
}


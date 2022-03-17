export interface StripeMetadata {
    userId?: string;
    amount?: number;
    owner?: string;
    site?: string;
    errorUrl?: string;
    successUrl?: string;
    intentType?: string; // any model type
    intentId?: string; // the id of this modelType
    intentPrice?: number; // the price of the model
    intent1?: string; // custom field
    intent2?: string; // custom field
    intent3?: string; // custom field
}

interface Data {
    object: StripeDataObject;
}

export interface StripeDataObject {
    id: string;
    object: string;
    allow_promotion_codes: any;
    amount_subtotal: any;
    amount_total: any;
    billing_address_collection: any;
    cancel_url: string;
    client_reference_id: any;
    currency: any;
    customer: any;
    customer_details: any;
    customer_email: any;
    livemode: boolean;
    locale: any;
    metadata: StripeMetadata;
    mode: string;
    payment_intent: string;
    payment_method_options: {};
    payment_method_types: string[];
    payment_status: string;
    setup_intent: any;
    shipping: any;
    shipping_address_collection: any;
    submit_type: any;
    subscription: any;
    success_url: string;
    total_details: any;
}

export interface StripeResponseWebhook {
    created: number;
    livemode: boolean;
    id: string;
    type: string;
    object: string;
    request: any;
    pending_webhooks: number;
    api_version: string;
    data: Data;
}

import emailjs from '@emailjs/browser';

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  selectedStacks?: string[];
}

export interface CostEstimateEmailPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  customStack?: string[];
  scale?: string;
  support?: string;
  services?: string[];
}

export interface EmailTargetResult {
  target: 'admin' | 'contact';
  success: boolean;
  status: number;
  text: string;
  error?: string;
}

export interface EmailServiceResult {
  success: boolean;
  status: number;
  text: string;
  error?: string;
  results?: {
    admin: EmailTargetResult;
    contact: EmailTargetResult;
  };
}

/**
 * Basic RFC 5322-compliant email format validation
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const getEmailConfig = () => {
  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
  const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();
  const contactTemplateId = (
    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || ''
  ).trim();
  const adminTemplateId = (
    import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || ''
  ).trim();

  return {
    serviceId,
    publicKey,
    contactTemplateId,
    adminTemplateId,
  };
};

interface BaseTemplateInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  techStack?: string;
  estimatorSummary?: string;
  toName: string;
}

const buildTemplateParams = (input: BaseTemplateInput): Record<string, unknown> => {
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim();
  const cleanPhone = input.phone?.trim() || 'N/A';
  const cleanCompany = input.company?.trim() || 'N/A';
  const cleanService =
    input.serviceType?.trim() || 'Custom Enterprise Web Portals';
  const cleanBudget = input.budget?.trim() || 'Unspecified';
  const cleanTimeline = input.timeline?.trim() || 'Unspecified';
  const cleanMessage =
    input.message?.trim() || 'No additional project details provided.';
  const cleanStack = input.techStack?.trim() || 'None specified';
  const cleanEstimator = input.estimatorSummary?.trim() || 'N/A';
  const nowStr = new Date().toLocaleString();

  return {
    // Primary Client & Recipient Identifiers
    name: cleanName,
    from_name: cleanName,
    user_name: cleanName,
    client_name: cleanName,
    to_name: input.toName,

    // Contact Information
    email: cleanEmail,
    from_email: cleanEmail,
    user_email: cleanEmail,
    reply_to: cleanEmail,
    phone: cleanPhone,
    phone_number: cleanPhone,
    user_phone: cleanPhone,
    company: cleanCompany,
    company_name: cleanCompany,

    // Subject & Timestamps
    title: `${cleanCompany} — ${cleanService}`,
    submitted_at: nowStr,
    submission_date: nowStr,

    // Scope & Service Specifications
    service: cleanService,
    service_type: cleanService,
    serviceType: cleanService,
    primary_service: cleanService,

    budget: cleanBudget,
    budget_range: cleanBudget,
    estimated_budget: cleanBudget,
    budget_bracket: cleanBudget,

    timeline: cleanTimeline,
    target_timeline: cleanTimeline,
    estimated_timeline: cleanTimeline,

    // Technical Specifications & Notes
    message: cleanMessage,
    notes: cleanMessage,
    scope_overview: cleanMessage,
    project_overview: cleanMessage,

    tech_stack: cleanStack,
    selected_stacks: cleanStack,
    custom_stack: cleanStack,
    estimator_summary: cleanEstimator,
  };
};

const validateBaseInput = (formData: {
  name?: string;
  email?: string;
}): EmailServiceResult | null => {
  if (!formData.name?.trim()) {
    return {
      success: false,
      status: 400,
      text: 'Validation Error',
      error: 'Please provide your full name.',
    };
  }

  if (!isValidEmail(formData.email || '')) {
    return {
      success: false,
      status: 400,
      text: 'Validation Error',
      error: 'Please provide a valid email address.',
    };
  }

  return null;
};

const sendSingleTemplate = async (
  target: 'admin' | 'contact',
  serviceId: string,
  publicKey: string,
  templateId: string,
  envVarName: string,
  templateParams: Record<string, unknown>
): Promise<EmailTargetResult> => {
  if (!serviceId || !publicKey || publicKey === 'YOUR_PUBLIC_KEY') {
    return {
      target,
      success: false,
      status: 400,
      text: 'Configuration Error',
      error:
        'Email service is currently unconfigured. Please set VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_PUBLIC_KEY in your .env file.',
    };
  }

  if (!templateId) {
    return {
      target,
      success: false,
      status: 400,
      text: 'Configuration Error',
      error: `Missing ${envVarName} in environment configuration.`,
    };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      { publicKey }
    );

    return {
      target,
      success: response.status === 200,
      status: response.status,
      text: response.text,
    };
  } catch (error: any) {
    const errorMessage =
      error?.text ||
      error?.message ||
      `Failed to send ${target} email via EmailJS.`;
    console.error(`[EmailJS] ${target} email send error:`, error);
    return {
      target,
      success: false,
      status: typeof error?.status === 'number' ? error.status : 500,
      text: 'Error',
      error: errorMessage,
    };
  }
};

const dispatchToBothTemplates = async (
  adminParams: Record<string, unknown>,
  contactParams: Record<string, unknown>
): Promise<EmailServiceResult> => {
  const { serviceId, publicKey, contactTemplateId, adminTemplateId } =
    getEmailConfig();

  const [adminSettled, contactSettled] = await Promise.allSettled([
    sendSingleTemplate(
      'admin',
      serviceId,
      publicKey,
      adminTemplateId,
      'VITE_EMAILJS_ADMIN_TEMPLATE_ID',
      adminParams
    ),
    sendSingleTemplate(
      'contact',
      serviceId,
      publicKey,
      contactTemplateId,
      'VITE_EMAILJS_CONTACT_TEMPLATE_ID',
      contactParams
    ),
  ]);

  const adminResult: EmailTargetResult =
    adminSettled.status === 'fulfilled'
      ? adminSettled.value
      : {
          target: 'admin',
          success: false,
          status: 500,
          text: 'Error',
          error: adminSettled.reason?.message || 'Unexpected admin send failure.',
        };

  const contactResult: EmailTargetResult =
    contactSettled.status === 'fulfilled'
      ? contactSettled.value
      : {
          target: 'contact',
          success: false,
          status: 500,
          text: 'Error',
          error:
            contactSettled.reason?.message || 'Unexpected contact send failure.',
        };

  const bothSucceeded = adminResult.success && contactResult.success;
  const anySucceeded = adminResult.success || contactResult.success;

  const combinedErrors = [
    !adminResult.success ? `Admin: ${adminResult.error}` : null,
    !contactResult.success ? `Contact: ${contactResult.error}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  return {
    success: bothSucceeded,
    status: bothSucceeded
      ? 200
      : anySucceeded
      ? 207
      : adminResult.status || contactResult.status || 500,
    text: bothSucceeded
      ? 'OK'
      : anySucceeded
      ? 'Partial Success'
      : 'Error',
    error: combinedErrors || undefined,
    results: {
      admin: adminResult,
      contact: contactResult,
    },
  };
};

/**
 * Send Contact Us inquiry to BOTH Admin and Contact templates via EmailJS
 */
export const sendContactEmail = async (
  formData: ContactEmailPayload
): Promise<EmailServiceResult> => {
  const validationError = validateBaseInput(formData);
  if (validationError) return validationError;

  const techStack =
    formData.selectedStacks && formData.selectedStacks.length > 0
      ? formData.selectedStacks.join(', ')
      : 'None specified';

  const baseInput = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    serviceType: formData.serviceType,
    budget: formData.budget,
    timeline: formData.timeline,
    message: formData.message,
    techStack,
    estimatorSummary: 'Contact Inquiry (No Cost Estimator)',
  };

  return dispatchToBothTemplates(
    buildTemplateParams({ ...baseInput, toName: 'Nexora Systems Team' }),
    buildTemplateParams({ ...baseInput, toName: formData.name.trim() })
  );
};

/**
 * Send Cost Estimate / Project Scope inquiry to BOTH Admin and Contact templates via EmailJS
 */
export const sendCostEstimateEmail = async (
  formData: CostEstimateEmailPayload
): Promise<EmailServiceResult> => {
  const validationError = validateBaseInput(formData);
  if (validationError) return validationError;

  const derivedService =
    formData.serviceType ||
    (formData.services && formData.services.length > 0
      ? formData.services.join(' + ')
      : 'Custom Web ERP & Enterprise Solution');

  const techStack =
    formData.customStack && formData.customStack.length > 0
      ? formData.customStack.join(', ')
      : 'Standard Recommended Architecture';

  const estimatorSummary =
    [
      formData.services?.length
        ? `Services: ${formData.services.join(', ')}`
        : null,
      formData.scale ? `Scale: ${formData.scale}` : null,
      formData.support ? `Support: ${formData.support}` : null,
    ]
      .filter(Boolean)
      .join(' | ') || 'N/A';

  const baseInput = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    serviceType: derivedService,
    budget: formData.budget || 'Custom Scope',
    timeline: formData.timeline || 'Sprint Milestone Delivery',
    message: formData.message || 'Cost estimate scope inquiry submitted.',
    techStack,
    estimatorSummary,
  };

  return dispatchToBothTemplates(
    buildTemplateParams({
      ...baseInput,
      toName: 'Nexora Systems Lead Architects',
    }),
    buildTemplateParams({ ...baseInput, toName: formData.name.trim() })
  );
};

/**
 * Dispatch Admin Password Reset OTP Email
 */
export const sendAdminOtpEmail = async (email: string, otpCode: string): Promise<boolean> => {
  const { serviceId, publicKey, adminTemplateId } = getEmailConfig();

  // If EmailJS is not configured or in dev, log to console
  if (!serviceId || !publicKey || !adminTemplateId) {
    console.log(`[OTP TRANSACTIONAL EMAIL] Delivered to ${email}: Your 6-digit verification code is: ${otpCode}`);
    return true;
  }

  try {
    const params = {
      to_email: email,
      to_name: 'Nexora Administrator',
      subject: 'Your Nexora Command Center Verification Code',
      message: `Your single-use 6-digit verification code is: ${otpCode}\n\nThis code is valid for 10 minutes. If you did not request this verification, please contact your security team immediately.`,
      otp_code: otpCode,
    };

    const res = await emailjs.send(serviceId, adminTemplateId, params, publicKey);
    return res.status === 200;
  } catch (err) {
    console.warn('[sendAdminOtpEmail] EmailJS dispatch fallback:', err);
    return false;
  }
};

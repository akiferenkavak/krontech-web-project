'use client';

import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { type Locale } from '@/i18n/config';
import PhoneInput from '@/components/form/PhoneInput';
import CountrySelect from '@/components/form/CountrySelect';

export interface FieldSchema {
  name: string;
  type: 'text' | 'email' | 'tel' | 'phone' | 'textarea' | 'select' | 'country' | 'product_select';
  required: boolean;
  label_tr: string;
  label_en: string;
  gridCol?: 'half' | 'full';
  options_tr?: string[];
  options_en?: string[];
  source?: string;
  endpoint?: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  slug: string;
  fieldsSchema: FieldSchema[];
  isActive: boolean;
}

interface DynamicFormProps {
  locale: Locale;
  slug: string;
  submitLabel?: string;
  prefilledProduct?: string;
  onSuccess?: () => void;
}

const i18n = {
  tr: {
    loading: 'Form yükleniyor...',
    error: 'Form yüklenemedi.',
    submitting: 'Gönderiliyor...',
    submit: 'Gönder',
    required: 'Bu alan zorunludur.',
    submitError: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    recaptchaRequired: 'Lütfen robot olmadığınızı doğrulayın.',
    kvkk1Label: "Kişisel verilerimin Türkiye'de ve yurt dışında yerleşik üçüncü taraflara <a href=\"/tr/privacy-policy\" class=\"text-blue-600 hover:underline\">Gizlilik Politikası</a> kapsamında aktarılmasına onay veriyorum ve konuyla ilgili bilgilendirildiğimi kabul ediyorum.",
    kvkk2Label: 'Kron ürün ve hizmetlerinin tanıtımı, reklamı ve bilgilendirmesi amacıyla kişisel verilerimin SMS veya e-posta ile ticari elektronik ileti gönderilmesi için işlenmesini ve <a href="/tr/information-note" class="text-blue-600 hover:underline">Bilgilendirme Notu</a> kapsamında kullanılmasını kabul ediyorum.',
    kvkkRequired: 'KVKK onayı zorunludur.',
    selectPlaceholder: 'Lütfen seçiniz',
    success: 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
  },
  en: {
    loading: 'Loading form...',
    error: 'Could not load form.',
    submitting: 'Submitting...',
    submit: 'Send',
    required: 'This field is required.',
    submitError: 'An error occurred. Please try again.',
    recaptchaRequired: 'Please verify that you are not a robot.',
    kvkk1Label: 'I hereby consent to the transfer of my personal data to third parties settled in Türkiye and abroad within the scope of the <a href="/en/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</a> and I accept that I have been duly informed regarding the subject.',
    kvkk2Label: 'I hereby consent to receiving commercial electronic messages by SMS or e-mail for promotion, information and advertisement of Kron products and services and processing of my personal data for such purpose in accordance with the <a href="/en/information-note" class="text-blue-600 hover:underline">Information Note</a>.',
    kvkkRequired: 'KVKK consent is required.',
    selectPlaceholder: 'Please select',
    success: 'Your request has been received. We will contact you shortly.',
  },
};

const errorCls = 'mt-1 text-xs text-red-500';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

const inputCls =
  'w-full border px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors rounded-sm';

export default function DynamicForm({
  locale,
  slug,
  submitLabel,
  prefilledProduct = '',
  onSuccess,
}: DynamicFormProps) {
  const copy = i18n[locale];
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [kvkk1, setKvkk1] = useState(false);
  const [kvkk2, setKvkk2] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [products, setProducts] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/forms/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((def: FormDefinition) => {
        setFormDef(def);
        const initial: Record<string, string> = {};
        def.fieldsSchema?.forEach((f) => {
          initial[f.name] = f.name === 'product' ? prefilledProduct : '';
        });
        setValues(initial);
      })
      .catch(() => setLoadError(true));
  }, [slug, prefilledProduct]);

  useEffect(() => {
    if (!formDef?.fieldsSchema?.some((f) => f.type === 'product_select')) return;
    fetch(`${API_BASE}/products?lang=${locale}`)
      .then((r) => r.json())
      .then((data: { slug: string; title: string }[]) => setProducts(data))
      .catch(() => {});
  }, [formDef, locale]);

  function validate() {
    const errs: Record<string, string> = {};
    formDef?.fieldsSchema?.forEach((f) => {
      if (f.required && !values[f.name]?.trim()) errs[f.name] = copy.required;
    });
    if (!kvkk1) errs['kvkk1'] = copy.kvkkRequired;
    if (!recaptchaToken) errs['recaptcha'] = copy.recaptchaRequired;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch(`${API_BASE}/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formDefinitionId: formDef!.id,
          data: values,
          kvkkConsent: kvkk1,
          marketingConsent: kvkk2,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      onSuccess?.();
    } catch {
      setStatus('error');
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }

  function set(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  if (loadError) return <p className="text-sm text-gray-500 py-4">{copy.error}</p>;

  if (!formDef) return (
    <div className="py-8 text-center">
      <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-2 text-sm text-gray-400">{copy.loading}</p>
    </div>
  );

  if (status === 'success') return (
    <div className="py-10 text-center">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-800">{copy.success}</p>
    </div>
  );

  const fields = formDef.fieldsSchema ?? [];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {fields.map((field) => {
          const label = locale === 'tr' ? field.label_tr : field.label_en;
          const placeholder = field.required ? `${label} *` : label;
          const hasError = !!errors[field.name];
          const isHalfWidthType = ['email', 'product_select', 'country', 'phone'].includes(field.type);
          const colSpan = (field.gridCol === 'half' || isHalfWidthType) ? 'col-span-1' : 'col-span-2';

          return (
            <div key={field.name} className={colSpan}>
              {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                <input type={field.type} value={values[field.name] ?? ''} placeholder={placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={`${inputCls} ${hasError ? 'border-red-500' : 'border-gray-300'}`} />
              )}
              {field.type === 'phone' && (
                <PhoneInput fieldName={field.name} placeholder="Phone" hasError={hasError}
                  onChange={(val) => set(field.name, val)} />
              )}
              {field.type === 'country' && (
                <CountrySelect fieldName={field.name} placeholder={placeholder}
                  value={values[field.name] ?? ''} hasError={hasError} locale={locale}
                  onChange={(val) => set(field.name, val)} />
              )}
              {field.type === 'select' && (
                <select value={values[field.name] ?? ''} onChange={(e) => set(field.name, e.target.value)}
                  className={`${inputCls} ${hasError ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">{placeholder}</option>
                  {(locale === 'tr' ? field.options_tr : field.options_en)?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {field.type === 'product_select' && (
                <select value={values[field.name] ?? ''} onChange={(e) => set(field.name, e.target.value)}
                  className={`${inputCls} ${hasError ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">{placeholder}</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
              )}
              {field.type === 'textarea' && (
                <textarea rows={4} value={values[field.name] ?? ''} placeholder={placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={`${inputCls} resize-none ${hasError ? 'border-red-500' : 'border-gray-300'}`} />
              )}
              {hasError && <p className={errorCls}>{errors[field.name]}</p>}
            </div>
          );
        })}
      </div>

      {/* KVKK sol | reCAPTCHA + Send sağ */}
      <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 space-y-4 mt-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={kvkk1} onChange={(e) => setKvkk1(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 accent-[#0d6efd] rounded-sm" />
            <span className="text-[13px] text-gray-600 leading-snug"
              dangerouslySetInnerHTML={{ __html: copy.kvkk1Label }} />
          </label>
          {errors['kvkk1'] && <p className={`${errorCls} !mt-1`}>{errors['kvkk1']}</p>}

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={kvkk2} onChange={(e) => setKvkk2(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 accent-[#0d6efd] rounded-sm" />
            <span className="text-[13px] text-gray-600 leading-snug"
              dangerouslySetInnerHTML={{ __html: copy.kvkk2Label }} />
          </label>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-[304px] shrink-0">
          <div>
            <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} hl={locale}
              onChange={(token) => {
                setRecaptchaToken(token);
                if (token) setErrors((prev) => { const e = { ...prev }; delete e['recaptcha']; return e; });
              }}
              onExpired={() => setRecaptchaToken(null)}
            />
            {errors['recaptcha'] && <p className={errorCls}>{errors['recaptcha']}</p>}
          </div>
          {status === 'error' && <p className="text-sm text-red-500 w-full text-right">{copy.submitError}</p>}
          <button type="submit" disabled={status === 'submitting'}
            className="w-full py-3 bg-[#0d6efd] text-white text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed rounded-sm">
            {status === 'submitting' ? copy.submitting : submitLabel ?? copy.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
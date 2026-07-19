# Padiworks web

Fresh Phase 1 implementation for the Padiworks Figma source.

## Routes

- `/signup` — account creation, consent gating, registration success toast.
- `/verify-email` — six-digit verification code entry and resend feedback.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/signup` at a 1440×1024 viewport for the initial Figma comparison.

## Phase 1 visual acceptance checklist

- Split is 600px artwork / 840px form at a 1440px viewport.
- Artwork outer/inner insets, form width, vertical positions, card crops, logo, icons, and arrow orientation match the Figma source.
- Signup CTA correctly reflects disabled, enabled, submitting, and successful registration states.
- Success toast is 404×64 and anchored at the documented upper-right position.
- OTP grouping, focus, paste, backspace, action state, resend state, and verification artwork match the verification frame.

See `../docs/design-context/phase-01-account-creation.md` for Figma node references and exact measurements.

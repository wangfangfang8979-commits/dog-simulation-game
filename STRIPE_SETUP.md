# Stripe Payment Setup Guide

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete your account setup
3. Get your API keys from the Stripe Dashboard

## 2. Get Your Stripe Keys

### Publishable Key (Frontend)
- Go to Stripe Dashboard → Developers → API Keys
- Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

### Secret Key (Backend)
- Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
- **Keep this secret!** Never expose it in frontend code

## 3. Update Your Code

### Frontend (script.js)
Replace the placeholder in your `script.js`:
```javascript
// Replace this line:
this.stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');

// With your actual publishable key:
this.stripe = Stripe('pk_test_51ABC123DEF456...');
```

### Backend (Vercel Environment Variables)
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** Your Stripe secret key (`sk_test_...` or `sk_live_...`)
4. Save and redeploy

## 4. Test the Integration

### Test Card Numbers
Use these test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

### Test CVC
- Any 3-digit number (e.g., `123`)

### Test Expiry
- Any future date (e.g., `12/25`)

## 5. Production Setup

### Switch to Live Keys
1. Replace test keys with live keys
2. Update environment variables
3. Test thoroughly before going live

### Security Best Practices
- ✅ Never expose secret keys in frontend code
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Handle errors gracefully
- ✅ Log payment events for debugging

## 6. Features Included

### Payment Flow
1. User clicks "Purchase Portrait"
2. Stripe Elements loads secure card form
3. User enters card details
4. Payment is processed securely
5. Portrait is generated on success

### Error Handling
- ✅ Real-time card validation
- ✅ Payment failure messages
- ✅ Network error handling
- ✅ Loading states

### Security
- ✅ PCI compliant card input
- ✅ Secure payment processing
- ✅ No card data stored locally

## 7. Customization

### Change Price
Update the amount in `script.js`:
```javascript
amount: 499, // $4.99 in cents
```

### Change Currency
Update currency in both frontend and backend:
```javascript
currency: 'usd', // or 'eur', 'gbp', etc.
```

### Customize Styling
Update CSS in `styles.css` for the payment form appearance.

## 8. Troubleshooting

### Common Issues
1. **"Stripe is not defined"** - Check if Stripe script is loaded
2. **"Invalid API key"** - Verify your publishable key
3. **"Payment failed"** - Check server logs and Stripe Dashboard
4. **"CORS error"** - Ensure API endpoint is accessible

### Debug Mode
Enable Stripe debug mode:
```javascript
this.stripe = Stripe('pk_test_...', {
  apiVersion: '2020-08-27',
  debug: true
});
```

## 9. Monitoring

### Stripe Dashboard
- Monitor payments in real-time
- View payment analytics
- Handle refunds and disputes

### Vercel Logs
- Check function logs for API errors
- Monitor response times
- Debug deployment issues

Your Stripe integration is now ready! 🚀 
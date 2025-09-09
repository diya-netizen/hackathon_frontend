# Testing the Signup Functionality

## Prerequisites

1. **Frontend running** on http://localhost:3000
2. **Backend running** on http://localhost:3001 (following the `backend-setup.md` guide)
3. **Environment variables** set up in `.env.local`

## Test Steps

### 1. Test Signup Flow

1. **Navigate to signup page:**
   - Go to http://localhost:3000/signup
   - You should see the signup form with fields for:
     - First Name
     - Last Name
     - Email
     - Phone
     - Password
     - Confirm Password

2. **Fill out the form:**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone: `+1234567890`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Submit the form:**
   - Click "Create Account"
   - You should see a loading state
   - If successful, you'll get a success message
   - You'll be automatically redirected to `/login`

### 2. Test Error Handling

1. **Test password mismatch:**
   - Enter different passwords in Password and Confirm Password
   - Submit form
   - Should show "Passwords do not match!" error

2. **Test validation:**
   - Leave required fields empty
   - Submit form
   - Should show appropriate validation errors

3. **Test backend connection:**
   - Stop your backend server
   - Try to submit the form
   - Should show "Unable to connect to authentication service" error

### 3. Test Login with New Account

1. **Go to login page:**
   - Navigate to http://localhost:3000/login

2. **Login with new credentials:**
   - Email: `john.doe@example.com`
   - Password: `password123`

3. **Verify success:**
   - Should see "Login successful" message
   - Should be redirected to `/users` page

## Expected Behavior

### Successful Signup
- ✅ Form validation passes
- ✅ CSRF token is validated
- ✅ Backend receives registration request
- ✅ Account is created in backend
- ✅ Success message is shown
- ✅ User is redirected to login page
- ✅ Session cookie is set (optional)

### Error Scenarios
- ❌ Form validation fails → Show field errors
- ❌ CSRF token invalid → Show "Invalid session" error
- ❌ Backend unavailable → Show connection error
- ❌ Backend validation fails → Show backend error message
- ❌ Network error → Show generic error message

## Backend Requirements

The backend must have:
- `POST /auth/register` endpoint
- Accepts: `{ email, password, name }`
- Returns: `{ token, user }` on success
- Returns: `{ formError: "message" }` on failure

## Troubleshooting

### Common Issues

1. **"Backend service is not configured"**
   - Check `.env.local` has `NEST_API=http://localhost:3001`

2. **"Invalid session" error**
   - Refresh the page to get a new CSRF token
   - Check that cookies are enabled

3. **CORS errors**
   - Ensure backend has CORS enabled for `http://localhost:3000`
   - Check backend is running on port 3001

4. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify all required fields are filled
   - Check that CSRF token is loaded

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check Network tab** for failed requests
3. **Check backend logs** for incoming requests
4. **Verify environment variables** are loaded correctly
5. **Test backend endpoints** directly with Postman/curl

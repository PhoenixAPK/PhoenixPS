/**
 * Phoenix Printing Solutions - Authentication & Security Script
 * Handles Admin session management using Supabase.
 */

(function() {
    const AUTH_KEY = 'pps_admin_auth';
    const ATTEMPTS_KEY = 'pps_login_attempts';
    const LOCKOUT_KEY = 'pps_lockout_until';
    const MAX_ATTEMPTS = 3;
    const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes

    // Configuration for private pages
    const PRIVATE_PAGES = [
        'pendingqueue.html',
        'inprogress.html',
        'admininvoice.html',
        'archive.html'
    ];

    const path = window.location.pathname;
    const isPrivatePage = PRIVATE_PAGES.some(page => path.includes('/admin/' + page));
    const isAdminFolder = path.includes('/admin/');
    const isLoginPage = path.includes('adminlogin.html');

    // 1. Check if user is logged in
    async function isLoggedIn() {
        // Use Supabase session if available, or fallback to the AUTH_KEY for now to keep it simple
        // but the goal is to move everything to Supabase.
        // For now, let's keep the AUTH_KEY but verify it against Supabase if possible.
        return localStorage.getItem(AUTH_KEY) === 'true';
    }

    // 2. Security sensitive check for direct access
    async function handleDirectAccess() {
        const loggedIn = await isLoggedIn();
        if (isPrivatePage && !loggedIn) {
            // Treat as security-sensitive attempt
            localStorage.setItem('pps_direct_access_attempt', 'true');
            // From /admin/page.html to /admin/adminlogin.html
            window.location.href = 'adminlogin.html';
        }
    }

    // 3. Logout functionality
    window.logoutAdmin = function() {
        localStorage.removeItem(AUTH_KEY);
        // From /admin/page.html to public/index.html
        window.location.href = '../public/index.html';
    };

    // Run direct access check immediately if not on login page
    if (!isLoginPage) {
        handleDirectAccess();
    }

    // Export login function to window for adminlogin.html
    window.loginAdmin = async function(username, password) {
        const now = Date.now();
        const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0');

        if (now < lockoutUntil) {
            const minutesLeft = Math.ceil((lockoutUntil - now) / 60000);
            return { success: false, message: `Access blocked. Please try again in ${minutesLeft} minutes.` };
        }

        try {
            // Check credentials in Supabase pps_admins table
            const { data, error } = await window.supabaseClient
                .from('pps_admins')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (data && !error) {
                localStorage.setItem(AUTH_KEY, 'true');
                localStorage.removeItem(ATTEMPTS_KEY);
                localStorage.removeItem(LOCKOUT_KEY);
                localStorage.removeItem('pps_direct_access_attempt');
                return { success: true };
            } else {
                let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
                const isDirectAccess = localStorage.getItem('pps_direct_access_attempt') === 'true';

                if (isDirectAccess) {
                    localStorage.setItem(LOCKOUT_KEY, (now + LOCKOUT_DURATION).toString());
                    localStorage.removeItem(ATTEMPTS_KEY);
                    localStorage.removeItem('pps_direct_access_attempt');
                    return { success: false, message: 'Invalid credentials. Redirecting to home...', redirect: true };
                }

                if (attempts >= MAX_ATTEMPTS) {
                    localStorage.setItem(LOCKOUT_KEY, (now + LOCKOUT_DURATION).toString());
                    localStorage.removeItem(ATTEMPTS_KEY);
                    return { success: false, message: 'Too many failed attempts. Access blocked for 10 minutes.', redirect: true };
                }

                localStorage.setItem(ATTEMPTS_KEY, attempts.toString());
                return { success: false, message: `Invalid username or password. ${MAX_ATTEMPTS - attempts} attempts remaining.` };
            }
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: 'An error occurred during login. Please try again.' };
        }
    };
})();

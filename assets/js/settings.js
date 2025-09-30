// Settings page logic: displayName and country
(function(){
  const STORAGE_KEY = 'pd:user:profile'; // stores { displayName, country }
  const COUNTRY_CHANGES_KEY = 'pd:country:changes'; // stores { year, count, changes: [] }

  function loadProfileFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveProfileToStorage(profile) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch {}
  }

  function getCountryChanges() {
    try {
      const raw = localStorage.getItem(COUNTRY_CHANGES_KEY);
      const data = raw ? JSON.parse(raw) : {};
      const currentYear = new Date().getFullYear();
      
      // Reset if new year (starting January 1st)
      if (data.year !== currentYear) {
        return { year: currentYear, count: 0, changes: [] };
      }
      return data;
    } catch {
      return { year: new Date().getFullYear(), count: 0, changes: [] };
    }
  }

  function recordCountryChange(fromCountry, toCountry) {
    const changes = getCountryChanges();
    changes.count += 1;
    changes.changes.push({
      from: fromCountry,
      to: toCountry,
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    try {
      localStorage.setItem(COUNTRY_CHANGES_KEY, JSON.stringify(changes));
    } catch {}
    return changes;
  }

  function canChangeCountry() {
    const changes = getCountryChanges();
    return changes.count < 3;
  }

  function getRemainingChanges() {
    const changes = getCountryChanges();
    return Math.max(0, 3 - changes.count);
  }

  function populateCountries(select) {
    // Full country list with ISO code and flag emoji
    const countries = [
      { code: '', name: 'Select country', flag: '' },
      { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
      { code: 'AL', name: 'Albania', flag: '🇦🇱' },
      { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
      { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
      { code: 'AO', name: 'Angola', flag: '🇦🇴' },
      { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
      { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺' },
      { code: 'AT', name: 'Austria', flag: '🇦🇹' },
      { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
      { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
      { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
      { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
      { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
      { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
      { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
      { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
      { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
      { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
      { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
      { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
      { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
      { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
      { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
      { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
      { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
      { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
      { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
      { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦' },
      { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
      { code: 'TD', name: 'Chad', flag: '🇹🇩' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱' },
      { code: 'CN', name: 'China', flag: '🇨🇳' },
      { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
      { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
      { code: 'CG', name: 'Congo', flag: '🇨🇬' },
      { code: 'CD', name: 'Congo (Democratic Republic)', flag: '🇨🇩' },
      { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
      { code: 'CI', name: 'Cote d\'Ivoire', flag: '🇨🇮' },
      { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
      { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
      { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
      { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
      { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
      { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
      { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
      { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
      { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
      { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
      { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
      { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
      { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
      { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
      { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
      { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
      { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
      { code: 'FI', name: 'Finland', flag: '🇫🇮' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
      { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
      { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
      { code: 'GR', name: 'Greece', flag: '🇬🇷' },
      { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
      { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
      { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
      { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
      { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
      { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
      { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
      { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
      { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
      { code: 'IN', name: 'India', flag: '🇮🇳' },
      { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
      { code: 'IR', name: 'Iran', flag: '🇮🇷' },
      { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
      { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
      { code: 'IL', name: 'Israel', flag: '🇮🇱' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
      { code: 'JP', name: 'Japan', flag: '🇯🇵' },
      { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
      { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
      { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
      { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
      { code: 'KP', name: 'Korea (North)', flag: '🇰🇵' },
      { code: 'KR', name: 'Korea (South)', flag: '🇰🇷' },
      { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
      { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
      { code: 'LA', name: 'Laos', flag: '🇱🇦' },
      { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
      { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
      { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
      { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
      { code: 'LY', name: 'Libya', flag: '🇱🇾' },
      { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
      { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
      { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
      { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
      { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
      { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
      { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
      { code: 'ML', name: 'Mali', flag: '🇲🇱' },
      { code: 'MT', name: 'Malta', flag: '🇲🇹' },
      { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
      { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
      { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
      { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
      { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
      { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
      { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
      { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
      { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
      { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
      { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
      { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
      { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
      { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
      { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
      { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
      { code: 'NE', name: 'Niger', flag: '🇳🇪' },
      { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
      { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
      { code: 'NO', name: 'Norway', flag: '🇳🇴' },
      { code: 'OM', name: 'Oman', flag: '🇴🇲' },
      { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
      { code: 'PW', name: 'Palau', flag: '🇵🇼' },
      { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
      { code: 'PA', name: 'Panama', flag: '🇵🇦' },
      { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
      { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
      { code: 'PE', name: 'Peru', flag: '🇵🇪' },
      { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
      { code: 'PL', name: 'Poland', flag: '🇵🇱' },
      { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
      { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
      { code: 'RO', name: 'Romania', flag: '🇷🇴' },
      { code: 'RU', name: 'Russia', flag: '🇷🇺' },
      { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
      { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
      { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
      { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
      { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
      { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
      { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹' },
      { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
      { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
      { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
      { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
      { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
      { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
      { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
      { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
      { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
      { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
      { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
      { code: 'SS', name: 'South Sudan', flag: '��' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸' },
      { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
      { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
      { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
      { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
      { code: 'SY', name: 'Syria', flag: '🇸🇾' },
      { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
      { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
      { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
      { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
      { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
      { code: 'TG', name: 'Togo', flag: '🇹🇬' },
      { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
      { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
      { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
      { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
      { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
      { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
      { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
      { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
      { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'US', name: 'United States', flag: '🇺🇸' },
      { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
      { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
      { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
      { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
      { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
      { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
      { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
      { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
      { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
    ];
    
    select.innerHTML = countries.map(c => 
      `<option value="${c.code}" data-flag="${c.flag}">${c.name}</option>`
    ).join('');
    // Attach to element for later reference
    select._countries = countries;
  }

  async function loadCountryFromFirebase(countryEl) {
    try {
      const db = authManager.db;
      const user = authManager.getCurrentUser();
      if (!db || !user) return;
      
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const country = userData?.profile?.country || userData?.preferences?.country || null;
        if (country && countryEl) {
          countryEl.value = country;
          // Also save to localStorage
          const stored = loadProfileFromStorage();
          stored.country = country;
          saveProfileToStorage(stored);
          // Update flag preview
          const event = new Event('change');
          countryEl.dispatchEvent(event);
        }
      }
    } catch (e) {
      console.warn('[Settings] Failed to load country from Firebase:', e);
    }
  }

  async function updateCloudProfile(displayName, country) {
    if (!window.authManager || !authManager.user) return { success: true };
    try {
      // Update auth displayName
      if (displayName && authManager.user.displayName !== displayName) {
        await authManager.user.updateProfile({ displayName: displayName });
      }

      // Update Firestore user doc with preferences
      const db = authManager.db;
      await db.collection('users').doc(authManager.user.uid).set({
        displayName: displayName || authManager.user.displayName || null,
        profile: { displayName: displayName || null, country: country || null },
        preferences: { country: country || null }
      }, { merge: true });

      // Emit a custom event so header can refresh name
      document.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { displayName, country } }));
      return { success: true };
    } catch (e) {
      console.error('[Settings] Failed to update cloud profile', e);
      return { success: false, error: e?.message || String(e) };
    }
  }

  function showToast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#2563eb;color:#fff;padding:10px 14px;border-radius:10px;z-index:10000;box-shadow:0 6px 16px rgba(0,0,0,.2)';
    document.body.appendChild(el);
    setTimeout(() => { el.remove(); }, 2500);
  }

  function init() {
    // Initialize theme immediately on page load
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const displayNameEl = document.getElementById('displayName');
    const countryEl = document.getElementById('country');
    const saveBtn = document.getElementById('saveSettings');
    const resetProgressBtn = document.getElementById('resetProgress');
    const deleteAccountBtn = document.getElementById('deleteAccount');
    const settingsSignOutBtn = document.getElementById('settingsSignOut');
    if (!displayNameEl || !countryEl) return;

    // Function to update UI based on auth state
    const updateUIForAuthState = (isSignedIn, userData = null) => {
      const settingsCard = document.querySelector('.settings-card');
      const actionsCard = document.querySelector('.actions-card');
      
      if (!isSignedIn) {
        // Hide settings form and show sign-in message
        if (settingsCard) {
          settingsCard.innerHTML = `
            <h1>Account Settings</h1>
            <div style="text-align: center; padding: 3rem 2rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
              <h2 style="color: var(--text-primary); margin-bottom: 1rem;">Sign In Required</h2>
              <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                You need to sign in to access your account settings and manage your profile.
              </p>
              <button onclick="window.authUI?.openModal()" class="btn-primary">
                Sign In to Continue
              </button>
            </div>
          `;
        }
        
        // Hide account actions for signed-out users
        if (actionsCard) {
          actionsCard.style.display = 'none';
        }
        return;
      }
      
      // User is signed in - show normal UI
      if (actionsCard) {
        actionsCard.style.display = 'block';
      }
      
      // Restore the original settings form if it was replaced
      if (settingsCard && !settingsCard.querySelector('#displayName')) {
        settingsCard.innerHTML = `
          <h1>Account Settings</h1>
          <p class="note">Update your display info used across the site.</p>
          <div class="form-grid">
            <div class="form-group">
              <label for="displayName" class="form-label">👤 Name</label>
              <input id="displayName" class="form-input" placeholder="Enter your name" />
              <div class="note">Shown in header and dashboard.</div>
            </div>
            <div class="form-group">
              <label for="country" class="form-label">🌍 Country</label>
              <div class="country-select-wrapper">
                <img id="countryFlagIcon" class="flag-icon" alt="Country flag" />
                <select id="country" class="form-select"></select>
              </div>
              <div class="country-limit" id="countryLimit" style="display: none;">
                <span id="changesLeft"></span>
              </div>
            </div>
            <div class="form-group">
              <label for="theme-select" class="form-label">🎨 Site Theme</label>
              <select id="theme-select" class="form-select">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div class="note">This is now the only place to change appearance. Your choice is saved.</div>
            </div>
          </div>
          <div class="form-actions">
            <button id="saveSettings" class="btn-primary">Save Changes</button>
          </div>
        `;
        
        // Re-initialize the form after recreating it
        setTimeout(() => {
          initializeForm();
        }, 100);
      }
    };

    // Function to initialize form elements and event listeners
    const initializeForm = () => {
      const displayNameEl = document.getElementById('displayName');
      const countryEl = document.getElementById('country');
      const themeSelectEl = document.getElementById('theme-select');
      const saveBtn = document.getElementById('saveSettings');
      
      if (!displayNameEl || !countryEl) return;

      populateCountries(countryEl);

      const stored = loadProfileFromStorage();
      
      // Load displayName: prefer Firebase Auth displayName, then stored value
      if (window.authManager && authManager.user && authManager.user.displayName) {
        displayNameEl.value = authManager.user.displayName;
      } else if (stored.displayName) {
        displayNameEl.value = stored.displayName;
      }
      
      // Load country: try localStorage first, then Firebase user document
      if (stored.country) {
        countryEl.value = stored.country;
        updateFlagPreview();
      } else if (window.authManager && authManager.isSignedIn()) {
        // Try to load from Firebase
        loadCountryFromFirebase(countryEl);
      }

      // Initialize theme select with current theme
      if (themeSelectEl) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        themeSelectEl.value = currentTheme;
      }

      const wrapper = document.querySelector('.country-select-wrapper');
      const flagImg = document.getElementById('countryFlagIcon');

      const updateFlagPreview = () => {
        const code = countryEl.value;
        const list = countryEl._countries || [];
        const entry = list.find(c => c.code === code);
        const flag = entry?.flag || '';
        if (flag && flagImg) {
          const toCodePoints = (emoji = '') => Array.from(emoji).map(ch => ch.codePointAt(0).toString(16)).join('-');
          const cps = toCodePoints(flag);
          flagImg.src = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${cps}.svg`;
          flagImg.alt = `${entry.name} flag`;
          wrapper?.classList.add('has-flag');
        } else {
          if (flagImg) flagImg.removeAttribute('src');
          wrapper?.classList.remove('has-flag');
        }
      };

      updateFlagPreview();
      updateCountryLimitUI();
      countryEl.addEventListener('change', updateFlagPreview);

      function updateCountryLimitUI() {
        const limitEl = document.getElementById('countryLimit');
        const changesLeftEl = document.getElementById('changesLeft');
        
        if (!limitEl || !changesLeftEl) return;
        
        const changes = getCountryChanges();
        const remaining = getRemainingChanges();
        
        if (changes.count === 0) {
          limitEl.style.display = 'none';
        } else {
          limitEl.style.display = 'flex';
          
          if (remaining === 0) {
            const nextYear = new Date().getFullYear() + 1;
            limitEl.style.borderColor = '#ef4444';
            limitEl.style.background = 'rgba(239, 68, 68, 0.1)';
            limitEl.style.color = '#b91c1c';
            changesLeftEl.textContent = `No more changes allowed until January 1, ${nextYear}.`;
          } else {
            limitEl.style.borderColor = 'var(--warning-color)';
            limitEl.style.background = 'rgba(245, 158, 11, 0.1)';
            limitEl.style.color = '#92400e';
            changesLeftEl.textContent = `${remaining} change${remaining !== 1 ? 's' : ''} remaining this year.`;
          }
        }
      }

      saveBtn?.addEventListener('click', async () => {
        const displayName = displayNameEl.value.trim();
        const country = countryEl.value;
        const theme = themeSelectEl ? themeSelectEl.value : null;
        
        // Check if country is being changed
        const stored = loadProfileFromStorage();
        if (country && stored.country && country !== stored.country) {
          if (!canChangeCountry()) {
            const nextYear = new Date().getFullYear() + 1;
            alert(`You have reached the limit of 3 country changes per year. You can change it again starting January 1, ${nextYear}.`);
            return;
          }
          // Record the change
          recordCountryChange(stored.country, country);
          updateCountryLimitUI();
        }
        
        // Apply theme if changed
        if (theme) {
          const currentTheme = localStorage.getItem('theme') || 'light';
          if (theme !== currentTheme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
          }
        }
        
        const profile = { displayName, country };
        saveProfileToStorage(profile);
        const result = await updateCloudProfile(displayName, country);
        if (result.success) showToast('Settings saved'); else showToast('Save failed: ' + result.error);
      });
    };

    // Check initial auth state
    if (window.authManager) {
      const currentUser = authManager.getCurrentUser();
      updateUIForAuthState(!!currentUser, currentUser);
      
      // Listen for auth state changes
      authManager.on('authStateChanged', (user) => {
        updateUIForAuthState(!!user, user);
      });
    } else {
      // AuthManager not loaded yet, show signed-out state
      updateUIForAuthState(false);
    }

    // Initialize form if user is already signed in
    if (window.authManager && authManager.getCurrentUser()) {
      populateCountries(countryEl);
      initializeForm();
    }

    // Action button event listeners (these work regardless of auth state)
    settingsSignOutBtn?.addEventListener('click', async () => {
      try {
        if (window.authUI && typeof authUI.signOut === 'function') {
          await authUI.signOut();
        } else if (window.authManager) {
          await authManager.signOut();
        }
        showToast('Signed out');
        // Redirect to home page after sign out
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } catch (e) {
        showToast('Sign out failed');
      }
    });

    // Reset all progress (local + cloud)
    resetProgressBtn?.addEventListener('click', async () => {
      if (!window.authManager || !authManager.getCurrentUser()) {
        alert('You need to be signed in to reset progress.');
        return;
      }
      
      if (!confirm('Reset all progress? This will clear your quiz history, stats, and chapter progress. This action cannot be undone.')) return;
      try {
        // Clear local progress keys conservatively
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (/chapter|quiz|progress|pd:user:profile|completedChapters|quizHistory/i.test(k)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        // Keep profile displayName and country; re-save after purge
        const profile = loadProfileFromStorage();
        if (profile && (profile.displayName || profile.country)) saveProfileToStorage(profile);

        // Cloud cleanup if signed in
        if (window.authManager && authManager.user) {
          const uid = authManager.user.uid;
          const userRef = authManager.db.collection('users').doc(uid);
          // Delete quizzes subcollection (batch by page)
          const quizzesSnap = await userRef.collection('quizzes').limit(200).get();
          const batch = authManager.db.batch();
          quizzesSnap.forEach(doc => batch.delete(doc.ref));
          await batch.commit().catch(()=>{});
          // Reset stats/progress docs
          await userRef.set({
            stats: { totalQuizzes: 0, correctAnswers: 0, totalTime: 0, chaptersCompleted: 0, topicsStudied: [] },
          }, { merge: true });
          await userRef.collection('progress').doc('data').set({ progress: {}, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
        showToast('Progress reset');
        document.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: loadProfileFromStorage() }));
      } catch (e) {
        console.error(e);
        showToast('Failed to reset progress');
      }
    });

    // Delete account permanently
    deleteAccountBtn?.addEventListener('click', async () => {
      if (!window.authManager || !authManager.user) {
        alert('You need to be signed in to delete your account.');
        return;
      }
      const step1 = confirm('Delete your account permanently? This removes your data and cannot be undone.');
      if (!step1) return;
      const step2 = prompt('Type DELETE to confirm account deletion');
      if (step2 !== 'DELETE') return;
      try {
        const uid = authManager.user.uid;
        const db = authManager.db;
        const userRef = db.collection('users').doc(uid);

        // Delete subcollections and all user data recursively
        const deleteCollection = async (ref) => {
          const snap = await ref.limit(200).get();
          if (snap.empty) return;
          const batch = db.batch();
          snap.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
          await deleteCollection(ref); // continue until empty
        };
        
        // Delete all quizzes
        await deleteCollection(userRef.collection('quizzes'));
        
        // Delete progress data
        await deleteCollection(userRef.collection('progress'));
        
        // Delete ALL xp_logs from this user (not just mark them)
        await deleteCollection(db.collection('xp_logs').where('uid', '==', uid));
        
        // Delete user document
        await userRef.delete().catch(()=>{});

        // Delete Firebase Auth user
        await authManager.auth.currentUser.delete();
        showToast('Account deleted');
        setTimeout(() => { window.location.href = '/'; }, 800);
      } catch (e) {
        console.error('[DeleteAccount]', e);
        alert('Failed to delete account. You may need to re-authenticate and try again.');
      }
    });

    // Wait for authManager to be available if not loaded yet
    if (!window.authManager) {
      const checkAuthManager = () => {
        if (window.authManager) {
          const currentUser = authManager.getCurrentUser();
          updateUIForAuthState(!!currentUser, currentUser);
          
          authManager.on('authStateChanged', (user) => {
            updateUIForAuthState(!!user, user);
          });
        } else {
          setTimeout(checkAuthManager, 100);
        }
      };
      checkAuthManager();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

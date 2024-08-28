import _kc from '../keycloak';

export const AUTH_TOKEN = '__auth_token';

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.log('User is not authenticated.');
      } else {
        localStorage.setItem(AUTH_TOKEN, `${_kc.token}`);
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);

  _kc.onTokenExpired = () => {
    _kc.updateToken(5).then((refreshed) => {
      if (refreshed) {
        localStorage.setItem(AUTH_TOKEN, `${_kc.token}`);
      }
    });
  };
};

const doLogin = _kc.login;
const doLogout = _kc.logout;
const getToken = () => _kc.token;
const isLoggedIn = () => !!_kc.token;
const getDisplayName = () => _kc.tokenParsed?.display_name;
const getUsername = () => _kc.tokenParsed?.idir_username;

// debug function
const getTokenAge = (): number => {
  const token = _kc.tokenParsed;
  if (!token || !token.iat) return 0;
  return Math.floor(Date.now() / 1000) - token.iat;
};

const updateToken = (minValidity: number = 10): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For testing: always refresh if token is older than 10s
    const tokenAge = getTokenAge();
    if (tokenAge > 180) {
      _kc
        .updateToken(-1) // Force refresh
        .then((refreshed) => {
          if (refreshed) {
            const newToken = _kc.token;
            localStorage.setItem(AUTH_TOKEN, `${newToken}`);
            resolve(newToken!);
          } else {
            resolve(_kc.token!); // Token is still valid
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      _kc
        .updateToken(minValidity)
        .then((refreshed) => {
          if (refreshed) {
            const newToken = _kc.token;
            localStorage.setItem(AUTH_TOKEN, `${newToken}`);
            resolve(newToken!);
          } else {
            resolve(_kc.token!); // Token is still valid
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

/**
 * Determines if a user's role(s) overlap with the role on the private route.  The user's role is determined via jwt.client_roles
 * @param roles
 * @returns True or false, inidicating if the user has the role or not.
 */
const hasRole = (roles: string[]) => {
  const jwt = _kc.tokenParsed;
  const userroles = jwt?.client_roles;
  const includesRoles =
    typeof roles === 'string' ? userroles?.includes(roles) : roles.some((r: any) => userroles?.includes(r));
  return includesRoles;
};

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  getDisplayName,
  hasRole,
  getTokenAge,
};

export default UserService;

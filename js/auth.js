// AWS Cognito Configuration
const AWS_CONFIG = {
    region: 'us-east-1', // Replace with your region
    IdentityPoolId: 'YOUR_IDENTITY_POOL_ID', // Optional if using Cognito User Pools only
    UserPoolId: 'us-east-1_YOUR_POOL_ID',
    ClientId: 'YOUR_CLIENT_ID'
};

// Initialize AWS
AWS.config.update({
    region: AWS_CONFIG.region
});

// Cognito User Pool
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: AWS_CONFIG.UserPoolId,
    ClientId: AWS_CONFIG.ClientId
});

// Register a new user
async function registerUser(email, password, phone) {
    return new Promise((resolve, reject) => {
        const attributeList = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'email',
                Value: email
            }),
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'phone_number',
                Value: phone
            })
        ];

        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                reject(new Error(err.message || 'Registration failed'));
                return;
            }
            resolve(result.user);
        });
    });
}

// Login existing user
async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const accessToken = result.getAccessToken().getJwtToken();
                const idToken = result.getIdToken().getJwtToken();
                
                // Store tokens (in real app, use secure HTTP-only cookies)
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('idToken', idToken);
                
                resolve(result);
            },
            onFailure: (err) => {
                reject(new Error(err.message || 'Login failed'));
            },
            newPasswordRequired: (userAttributes) => {
                // Handle case where new password is required
                reject(new Error('Password change required'));
            }
        });
    });
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
}

// Get current user
function getCurrentUser() {
    return new Promise((resolve) => {
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
            resolve(null);
            return;
        }
        
        cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
                resolve(null);
            } else {
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        resolve(null);
                    } else {
                        const user = {
                            username: cognitoUser.username,
                            attributes: {}
                        };
                        
                        attributes.forEach(attr => {
                            user.attributes[attr.Name] = attr.Value;
                        });
                        
                        resolve(user);
                    }
                });
            }
        });
    });
}

// Logout user
function logout() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
}

// Social login functions
async function loginWithGoogle() {
    // Implementation would use Cognito Hosted UI or Firebase
    alert('Google login would be implemented here');
}

async function loginWithFacebook() {
    // Implementation would use Cognito Hosted UI or Firebase
    alert('Facebook login would be implemented here');
}

// Password reset
async function forgotPassword(email) {
    return new Promise((resolve, reject) => {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
        
        cognitoUser.forgotPassword({
            onSuccess: () => resolve(),
            onFailure: (err) => reject(new Error(err.message || 'Password reset failed'))
        });
    });
}

// Confirm password reset
async function confirmPassword(email, verificationCode, newPassword) {
    return new Promise((resolve, reject) => {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
        
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => resolve(),
            onFailure: (err) => reject(new Error(err.message || 'Password confirmation failed'))
        });
    });
}
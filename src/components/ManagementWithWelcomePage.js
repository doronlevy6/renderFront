// src/components/ManagementWithWelcomePage.js
import React from 'react';
import ManagementPage from './ManagementPage';
import WelcomePage from './WelcomePage';
import './ManagementWithWelcomePage.css'; // Create this CSS file for styling

function ManagementWithWelcomePage() {
    return (
        <div className="management-with-welcome-container" >
            <div className="management-page" >
                <ManagementPage />
            </div>
            < div className="welcome-page" >
                <WelcomePage />
            </div>
        </div>
    );
}

export default ManagementWithWelcomePage;

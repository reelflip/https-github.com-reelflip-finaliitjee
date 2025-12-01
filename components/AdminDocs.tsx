import React from 'react';
// Simplified docs for the single-file version
const AdminDocs: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Deployment Guide (One-File Mode)</h1>
            <p>You have successfully switched to the self-contained index.html version.</p>
            <p>Simply upload this index.html to your hostinger public_html folder along with the backend folder.</p>
        </div>
    );
};
export default AdminDocs;
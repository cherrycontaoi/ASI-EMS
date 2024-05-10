import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/logo-asi.png";
import "./UploadDocument.css";
import AdminSignin from "./AdminSignin";
import { AuthProvider } from "./AuthContext";

const API_BASE = "http://localhost:3001";

function UploadDocument() {
    const navigate = useNavigate();
    const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    const [isHovering, setIsHovering] = useState(false);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  
    const handleLogout = () => {
      sessionStorage.removeItem('isAdminLoggedIn');
      window.location.reload();
    };

    const [documentCopy, setFile] = useState(null);
    const [newDocument, setNewDocument] = useState({
        documentType: "",
        documentNumber: "", 
        uploaderName: "",
        description: "",
        dateAcquired: "",
        quantity: ""
    });
    const [showValidation, setShowValidation] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        // Check if any of the fields are empty
        if (
            !newDocument.documentType ||
            !newDocument.documentNumber || // Check for documentNumber
            !newDocument.uploaderName ||
            !newDocument.description ||
            !newDocument.dateAcquired ||
            !newDocument.quantity ||
            !documentCopy
        ) {
            alert("Please fill in all fields and select a file.");
            return;
        }

        setShowValidation(true);
    };

    const handleCancel = () => {
        setShowValidation(false);
    };

    const addDocument = async () => {
        try {
            setShowValidation(false); // Hide validation popup

            const formData = new FormData();
            formData.append("documentType", newDocument.documentType);
            formData.append("documentNumber", newDocument.documentNumber); // Append documentNumber
            formData.append("uploaderName", newDocument.uploaderName);
            formData.append("description", newDocument.description);
            formData.append("dateAcquired", newDocument.dateAcquired);
            formData.append("quantity", newDocument.quantity);
            formData.append("documentCopy", documentCopy);

            const response = await fetch(API_BASE + "/document/new", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to add document");
            }

            const data = await response.json();
            console.log("Document added successfully:", data);

            setUploadSuccess(true);
        } catch (error) {
            console.error("Error adding document:", error.message);
        }
    };

    const handleReturnToHomepage = () => {
        navigate("/");
    };

    if (uploadSuccess) {
        return (
            
            <div className="successful-upload">
                <div className="header">
                    <a href="/">
                        <img src={logo} alt="" id="asi-logo" />
                    </a>
                    {isAdminLoggedIn ? (
                        <div id="admin-greeting" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        Hello, Admin!
                        {isHovering && (
                            <div id="admin-dropdown">
                            <button className="admin-button" onClick={handleLogout}>Sign out</button>
                            </div>
                        )}
                        </div>
                    ) : (
                        <div id="admin-login-div">
                        {!isLoginFormVisible && (
                            <text id="admin-login-button" onClick={() => setIsLoginFormVisible(true)}>Sign in</text>
                        )}
                        </div>
                    )}
                    {isLoginFormVisible && !isAdminLoggedIn && (
                        <div className="admin-login-form">
                        <AdminSignin />
                        </div>
                    )}
                    </div>
                <div className="upload-form-success">
                    Uploading Successful!
                    <div className="form-space">
                        <div className="left-side">
                            <div className="input-field">
                                Document Type
                                <p id="field">{newDocument.documentType}</p>
                            </div>
                            <div className="input-field">
                                Uploader Name
                                <p id="field">{newDocument.uploaderName}</p>
                            </div>
                            <div className="input-field">
                                Description 
                                <p id="field">{newDocument.description}</p>
                                
                            </div>
                            <div className="input-field">
                                Date Acquired
                                <p id="field">{newDocument.dateAcquired}</p>
                                
                            </div>
                        </div>
                        <div className="right-side">

                            <div className="input-field">
                                Document Number 
                                <p id="field">{newDocument.documentNumber}</p>
                            </div>
                            <div className="input-field">
                                Quantity
                                <p id="field">{newDocument.quantity}</p>
                            
                            </div>
                        </div>
                        
                    </div>
                    <div className="return-button">
                        <button id="return-home" onClick={handleReturnToHomepage}>Return to Homepage</button>
                    </div>
                </div>
                
            </div>
        );
    }

    return (
        <>
          
            <div className="page-body">
                <div className="header">
                    <a href="/">
                        <img src={logo} alt="" id="asi-logo" />
                    </a>
                    {isAdminLoggedIn ? (
                        <div id="admin-greeting" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        Hello, Admin!
                        {isHovering && (
                            <div id="admin-dropdown">
                            <button className="admin-button" onClick={handleLogout}>Sign out</button>
                            </div>
                        )}
                        </div>
                    ) : (
                        <div id="admin-login-div">
                        {!isLoginFormVisible && (
                            <text id="admin-login-button" onClick={() => setIsLoginFormVisible(true)}>Sign in</text>
                        )}
                        </div>
                    )}
                    {isLoginFormVisible && !isAdminLoggedIn && (
                        <div className="admin-login-form">
                        <AdminSignin />
                        </div>
                    )}
                </div>


                <div className="upload-form">
                Upload Document
                <div className="form-space">
                    <div className="left-side">

                        <div className="input-field">
                            Document Type<br/>
                            <select
                                className="add-document-input" id="field"
                                onChange={(e) =>
                                    setNewDocument({ ...newDocument, documentType: e.target.value })
                                }
                                value={newDocument.documentType}
                            >
                                <option value="">Select Document Type</option>
                                <option value="ICS">ICS</option>
                                <option value="PAR">PAR</option>
                            </select><br/>
                        </div>

                        <div className="input-field">
                            Name<br/>
                            <input
                                type="text" id="field"
                                placeholder=""
                                value={newDocument.uploaderName}
                                onChange={(e) =>
                                    setNewDocument({ ...newDocument, uploaderName: e.target.value })
                                }
                            /><br/>
                        </div>

                        <div className="input-field">
                            Description<br/>
                            <input
                                type="text" id="field"
                                placeholder=""
                                value={newDocument.description}
                                onChange={(e) =>
                                    setNewDocument({ ...newDocument, description: e.target.value })
                                }
                            /><br/>
                        </div>
                        <div className="input-field">
                            Date Acquired<br/>
                            <input
                                type="date" id="field"
                                placeholder=""
                                value={newDocument.dateAcquired}
                                onChange={(e) =>
                                    setNewDocument({ ...newDocument, dateAcquired: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="input-field">
                                Document Number<br/>
                                <input
                                    type="number" id="field"
                                    placeholder=""
                                    value={newDocument.documentNumber}
                                    onChange={(e) =>
                                        setNewDocument({ ...newDocument, documentNumber: e.target.value })
                                    }
                                /><br/>
                            </div>
                        <div className="input-field">
                            Quantity<br/>
                            <input
                                type="number" id="field"
                                placeholder=""
                                value={newDocument.quantity}
                                onChange={(e) =>
                                    setNewDocument({ ...newDocument, quantity: e.target.value })
                                }
                            /><br/>
                        </div>
                        <div className="input-field">
                            Copy of Document<br/>
                            <input
                                type="file" id="file-field"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
                        </div>
                        
                        
                    </div>
                </div>                
                <button onClick={handleSubmit} id="submit-button">UPLOAD</button>
                
                </div>
                {showValidation && (
                    <div className="validation-popup">
                        <p>Are you sure you want to submit?</p>
                        <div className="popupButtons">
                            <div className="cancel-button">
                                <button onClick={handleCancel} id="popupButton1">CANCEL</button>
                            </div>
                            <div className="upload-button">
                                <button onClick={addDocument} id="popupButton2">UPLOAD</button>
                            </div>
                        </div>
                    </div>
                )}
                
            </div>
        </>
    );
}

export default UploadDocument;

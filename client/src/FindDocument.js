import React, { useState, useEffect } from "react";
import "./FindDocument.css";
import logo from "./images/logo-asi.png";
import * as XLSX from "xlsx";
import AdminSignin from "./AdminSignin";

const API_BASE = "https://asi-ems-backend-1.onrender.com";

function FindDocument({ isAdminLoggedIn }) {
    const [documents, setDocuments] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [isHovering, setIsHovering] = useState(false);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        getDocuments();
    }, []);

    const getDocuments = () => {
        setIsLoading(true); // Set loading to true when fetching starts
        fetch(API_BASE + "/documents")
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data);
                setFilteredDocuments(data);
            })
            .catch((err) => console.error("Error: ", err))
            .finally(() => setIsLoading(false)); // Set loading to false when fetching ends
    };

    const handleViewDocument = async (documentId) => {
        try {
            const response = await fetch(`${API_BASE}/document/${documentId}/view`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error("Error viewing document:", error.message);
        }
    };

    const handleSearch = () => {
        const lowercaseKeyword = searchKeyword.toLowerCase();
        const filteredDocs = documents.filter((doc) => {
            const lowercaseName = doc.uploaderName ? doc.uploaderName.toLowerCase() : "";
            const lowercaseType = doc.documentType ? doc.documentType.toLowerCase() : "";
            const lowercaseDescription = doc.description ? doc.description.toLowerCase() : "";
            return (
                lowercaseName.includes(lowercaseKeyword) ||
                lowercaseType.includes(lowercaseKeyword) ||
                lowercaseDescription.includes(lowercaseKeyword)
            );
        });
        setFilteredDocuments(filteredDocs);
    };

    const generateExcel = () => {
        const excelData = filteredDocuments.map((document) => ({
            "Document Type": document.documentType,
            "Document Number": document.documentNumber,
            Name: document.uploaderName,
            Description: document.description,
            "Date Acquired": document.dateAcquired ? document.dateAcquired.split("T")[0] : "",
            Quantity: document.quantity,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        XLSX.utils.book_append_sheet(wb, ws, "Uploaded Documents");

        XLSX.writeFile(wb, "[ASI-EMS] Uploaded-Documents.xlsx");
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            const response = await fetch(`${API_BASE}/admin/document/delete/${documentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // If deletion is successful, update the document list
                getDocuments();
            } else {
                // If deletion fails, throw an error and log the response
                const errorData = await response.json(); // Assuming the backend sends error details in JSON format
                throw new Error(`Failed to delete document: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error deleting document:", error.message);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.reload();
    };

    return (
        <>
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
            <div className="docs-body">
                <div className="document-list">
                    <div className="title-part">
                        <p id="uploaded-docs-text">Uploaded Documents</p>
                        {isAdminLoggedIn && (
                            <button onClick={generateExcel} id="generate-excel-button">
                                GENERATE EXCEL
                            </button>
                        )}
                    </div>
                    <div className="search-doc">
                        <input
                            id="search-field"
                            type="text"
                            placeholder="Search by document name, type, or description"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button onClick={handleSearch} id="search-button">
                            SEARCH
                        </button>
                    </div>
                    {isLoading ? (
                        <div id="doc-count">Fetching uploaded documents...</div>
                    ) : (
                        <>
                            <div id="doc-count">
                                Showing {filteredDocuments.length} documents
                            </div>
                            <ul className="docs-area">
                                <div className="list-of-docs">
                                    {filteredDocuments.map((document) => (
                                        <div key={document._id} id="uploaded-doc-line">
                                            <div className="doc-number">{document.documentNumber}</div>
                                            <div className="doc-uploaderName">
                                                <p>{document.uploaderName}</p>
                                            </div>
                                            <div className="doc-documentType">
                                                <p>{document.documentType}</p>
                                            </div>
                                            <div className="doc-description">
                                                <p>{document.description}</p>
                                            </div>
                                            <div className="doc-buttons">
                                                <button
                                                    className="view-button"
                                                    onClick={() => handleViewDocument(document._id)}
                                                >
                                                    View Document
                                                </button>
                                                {isAdminLoggedIn && (
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDeleteDocument(document._id)}
                                                    >
                                                        Delete Document
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default FindDocument;

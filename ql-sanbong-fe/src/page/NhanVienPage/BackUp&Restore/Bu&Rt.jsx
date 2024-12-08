import React, { useState, useEffect } from "react";
import "../QL.scss";
import "./Bu&Rt.scss";

const SaoLuu = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [backupFiles, setBackupFiles] = useState([]);

    useEffect(() => {
        const fetchBackupFiles = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/backup-files");
                const data = await response.json();
                if (data.files) {
                    setBackupFiles(data.files);
                }
            } catch (error) {
                console.error("Failed to fetch backup files:", error);
            }
        };

        fetchBackupFiles();
    }, []);

    const handleBackup = async () => {
        setLoading(true);
        setMessage("");
        try {
            const response = await fetch("http://127.0.0.1:8000/backup", {
                method: "POST",
            });
            const data = await response.json();
            setMessage(`${data.message}, ${data.backup_file}` || "Backup successful");
            if (data.backup_file) {
                const formattedFileName = data.backup_file.split("backups\\").pop();
                setBackupFiles([...backupFiles, formattedFileName]);
            }
        } catch (error) {
            setMessage("Backup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        setLoading(true);
        setMessage("");
        try {
            const selectedFile = document.getElementById("backup-files").value;
            if (!selectedFile) {
                setMessage("Please select a backup file to restore");
                setLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append("filename", selectedFile);

            const response = await fetch("http://127.0.0.1:8000/restore-by-filename", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message || "Restore successful");
        } catch (error) {
            setMessage("Restore failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="backup-restore-container">
            <h2>Sao Lưu và Khôi Phục</h2>
            <div className="backup-restore-buttons">
                <button
                    className="backup-restore-button"
                    onClick={handleBackup}
                    disabled={loading}
                >
                    Sao Lưu
                </button>
                <button
                    className="backup-restore-button"
                    onClick={handleRestore}
                    disabled={loading}
                >
                    Khôi Phục
                </button>
                <div className="backup-restore-select">
                    <label htmlFor="backup-files">Chọn file sao lưu:</label>
                    <select id="backup-files" name="backup-files">
                        <option value="">--Chọn file--</option>
                        {backupFiles.map((file, index) => (
                            <option key={index} value={file}>
                                {file}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {loading && <p className="loading">Đang xử lý...</p>}
            {message && (
                <p className={`message ${message.includes("failed") ? "error" : ""}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default SaoLuu;
import React, { useState, useEffect } from "react";
import "../QL.scss";

const QLDuyetDat = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeslots, setTimeslots] = useState({});
    const [userEmails, setUserEmails] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("id");
    const [selectedId, setSelectedId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/san/ds_dat_san")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setFilteredData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [refresh]);

    useEffect(() => {
        const fetchTimeslots = async () => {
            const timeslotData = { ...timeslots };
            try {
                for (const san of data) {
                    const timeslotId = san.timeslot_id;
                    if (timeslotId && !timeslotData[timeslotId]) {
                        const response = await fetch(`http://127.0.0.1:8000/san/get_timeslot_by_id/${timeslotId}`);
                        if (!response.ok) continue;
                        const timeslot = await response.json();
                        if (timeslot?.ngay && timeslot?.batdau && timeslot?.ketthuc) {
                            timeslotData[timeslotId] = timeslot;
                        }
                    }
                }
                setTimeslots(timeslotData);
            } catch (error) {
                console.error("Error fetching timeslots:", error.message);
            }
        };

        if (data.length > 0) {
            fetchTimeslots();
        }
    }, [data]);

    useEffect(() => {
        const fetchUserEmails = async () => {
            const emailData = { ...userEmails };
            try {
                for (const san of data) {
                    const userId = san.user_id;
                    if (userId && !emailData[userId]) {
                        const response = await fetch(`http://127.0.0.1:8000/user/get_user_by_id/${userId}`);
                        if (!response.ok) continue;
                        const user = await response.json();
                        if (user?.email) {
                            emailData[userId] = user.email;
                        }
                    }
                }
                setUserEmails(emailData);
            } catch (error) {
                console.error("Error fetching user emails:", error.message);
            }
        };

        if (data.length > 0) {
            fetchUserEmails();
        }
    }, [data]);

    const handleApprove = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn duyệt đơn này không?")) {
            fetch(`http://127.0.0.1:8000/san/approve_dat_san/${id}`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.message) {
                        window.alert(result.message);
                    } else {
                        window.alert("Duyệt đơn thành công!");
                    }
                    setRefresh(!refresh);
                })
                .catch((error) => {
                    console.error("Error approving booking:", error.message);
                    window.alert("Duyệt đơn thất bại!");
                });
        }
    };

    const handleReject = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn từ chối đơn này không?")) {
            fetch(`http://127.0.0.1:8000/san/reject_dat_san/${id}`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.message) {
                        window.alert(result.message);
                    } else {
                        window.alert("Từ chối đơn thành công!");
                    }
                    setRefresh(!refresh);
                })
                .catch((error) => {
                    console.error("Error rejecting booking:", error.message);
                    window.alert("Từ chối đơn thất bại!");
                });
        }
    };

    const handleRadioChange = (id) => {
        setSelectedId(id);
    };

    const selectedBooking = data.find(san => san.id === selectedId);
    const isDisabled = selectedBooking && (selectedBooking.status === 1 || selectedBooking.status === 2);

    return (
        <div>
            <h4>Quản lý duyệt đặt sân online</h4>
            
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : error ? (
                <p>Lỗi: {error}</p>
            ) : filteredData.length === 0 ? (
                <p>Chưa có đơn đặt sân</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email người đặt</th>
                            <th>Tên Sân</th>
                            <th>Khung giờ</th>
                            <th>Tên Sân</th>
                            <th>Giá</th>
                            <th>Thời gian đặt</th>
                            <th>Tình Trạng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((san) => (
                            <tr
                                key={san.id}
                                onClick={() => handleRadioChange(san.id)}
                                style={{
                                    backgroundColor: san.status === 0 ? "white" : san.status === 1 ? "lightgreen" : "lightcoral"
                                }}
                            >
                                <td>
                                <input
                                    type="radio"
                                    name="order"
                                    onChange={() => handleRadioChange(san.id)}
                                    checked={selectedId === san.id}
                                    style={{ marginRight: "5px" }}
                                />
                                    {san.id}</td>
                                <td>{userEmails[san.user_id] || "Đang tải..."}</td>
                                <td>{san.id_san}</td>
                                <td>
                                    {timeslots[san.timeslot_id]?.ngay &&
                                    timeslots[san.timeslot_id]?.batdau &&
                                    timeslots[san.timeslot_id]?.ketthuc ? (
                                        <>
                                            {timeslots[san.timeslot_id].ngay}
                                            <br />
                                            <strong>{timeslots[san.timeslot_id].batdau} - {timeslots[san.timeslot_id].ketthuc}</strong>
                                        </>
                                    ) : (
                                        "Chưa có dữ liệu"
                                    )}
                                </td>
                                <td>{san.id_san}</td>
                                <td>{san.gia.toLocaleString()} VND</td>
                                <td>{new Date(san.created_at).toLocaleString()}</td>
                                <td>
                                    {san.status === 0
                                        ? "Chờ duyệt"
                                        : san.status === 1
                                        ? "Đã duyệt"
                                        : "Từ chối"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            )}
            <div className="btn-chi-tiet-sp">
                <button onClick={() => handleApprove(selectedId)} disabled={isDisabled}>
                    Duyệt đơn
                </button>
                <button onClick={() => handleReject(selectedId)} disabled={isDisabled}>
                    Từ chối đơn
                </button>
            </div>
            
        </div>
        
    );
};

export default QLDuyetDat;

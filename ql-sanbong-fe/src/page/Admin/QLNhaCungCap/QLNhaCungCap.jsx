import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QLNhaCungCap.scss';
import SearchBar from '../SearchBar/SearchBar'; 

const QLNhaCungCap = ({ onSelectId = () => {} }) => {
  const [nhaCungCap, setNhaCungCap] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchField] = useState('ten_ncc'); 
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null); 

  useEffect(() => {
    
    axios
      .get('http:/*localhost:8000/Ncc/Ncc')
      .then((response) => {
        setNhaCungCap(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

 
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = nhaCungCap.filter((ncc) => {
      switch (searchType) {
        case 'ten_ncc':
          return ncc.ten_ncc.toLowerCase().includes(lowercasedSearchTerm);
        case 'email':
          return ncc.email.toLowerCase().includes(lowercasedSearchTerm);
        case 'sdt':
          return ncc.sdt.includes(lowercasedSearchTerm);
        default:
          return false;
      }
    });
    setFilteredData(filtered);
  }, [searchTerm, searchType, nhaCungCap]);

  
  const handleCheckboxChange = (id) => {
    setSelectedId(id);
    onSelectId(id); 
  };

  return (
    <div className="ql-nha-cung-cap">
      <h4>Quản lý nhà cung cấp</h4>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchField={setSearchField}
        searchLabel="NCC"
        searchOptions={[
          {value: "tenNcc", label: "Tìm kiếm theo tên Nhà cung cấp"},
          {value: "sdt", label: "Tìm kiếm theo số điện thoại"},
          {value: "email", label: "Tìm kiếm theo email"},
        ]}
      />

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên NCC</th>
            <th>Địa Chỉ</th>
            <th>Email</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((ncc) => (
              <tr 
                key={ncc.id} 
                onClick={() => handleCheckboxChange(ncc.id)}
              >
               
                <td>
                  <input
                    type="radio"
                    name="nccSelection"
                    checked={selectedId === ncc.id}
                    onChange={() => handleCheckboxChange(ncc.id)}
                  />
                  {ncc.id}
                </td>
                <td>{ncc.ten_ncc}</td>
                <td>{ncc.dia_chi}</td>
                <td>{ncc.email}</td>
                <td>{ncc.sdt}</td>
              </tr>
            )
          )}
        </tbody>
      </table>

      
    </div>
  );
};

export default QLNhaCungCap;

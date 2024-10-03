import React, { useState, useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import './portfolioCRUD.css';

const PortfolioCRUD = () => {
  const [clients, setClients] = useState([]);
  const [clientsCopy, setClientsCopy] = useState([]);
  const [show, setShow] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [maximizedImage, setMaximizedImage] = useState(null); 

  const [newClient, setNewClient] = useState({
    id: null,
    title: '',
    description: '',
    link: '',
    status: 'active',
    images: [],
  });

  useEffect(() => {  
    fetchClients();
  }, []); 

  const fetchClients = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients`);
      setClients(data);
      setClientsCopy(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const toggleImageSize = (image) => {
    if (maximizedImage === image) {

      // If clicked again, minimize the image
      setMaximizedImage(null); 

    } else {

      // Maximize the clicked image
      setMaximizedImage(image); 

    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async (clientId) => {
    const formData = new FormData();

    if (selectedFiles) 
      for (let i = 0; i < selectedFiles.length; i++) 
        formData.append('files', selectedFiles[i]);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/images/${clientId}`, 
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response) {
        alert('Files uploaded successfully!');
      }
      fetchClients();
    } catch (error) {
      setMessage('An error occurred while uploading the files.');
    }

  };

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value, images: [] });
  };

  const handleSubmit = async (e) => {

    //Add client
    if (newClient.id === null) {
      setClients([...clients, { ...newClient }]);
      setClientsCopy([...clients, { ...newClient }]);
 
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });

        if (response.ok) {
          alert("Client added successfully!");
          fetchClients();
        } else {
          throw new Error('Failed to add client');
        }
      } catch (error) {
          console.error(`Error: ${error.message}`);
      }

    } else {

      //Edit client
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/clients/update/${newClient.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });

        if (response.ok) {
          alert("Client edited successfully!");
        } else {
          throw new Error('Failed to add client');
        }
      } catch (error) {
          console.error(`Error: ${error.message}`);
      }

      setClients( clients.map((client) => client.id === newClient.id ? newClient : client ));
      setClientsCopy( clients.map((client) => client.id === newClient.id ? newClient : client ));
    }

    resetForm();
  };

  const handleEdit = (client) => {
    setNewClient(client);
  };

  const handleDelete = (id) => {
    deleteClient(id);
  };

  const resetForm = () => {
    setNewClient({
      id: null,
      title: '',
      description: '',
      link: '',
      status: 'active',
    });
  };

  const deleteClient = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      // Filter out the deleted client from the state
      setClients(clients.filter((client) => client.id !== id));
      setClientsCopy(clients.filter((client) => client.id !== id));

    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };    

  const handleToggle = (status) => {
    if (show !== status) {

      // When toggling to a specific status
      setClients(clientsCopy.filter(client => (status === 'all') ? client.status : client.status === status));

      setShow(status);
    } else {

      // Reset to "all" when toggling off
      setClients(clientsCopy.filter(client => client.status));

      setShow("all");
    }
  };

  const deleteImage = async (clientId, imageId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/images/${imageId}`);

      setClientsCopy(clientsCopy.map(client => {
        if (client.id === clientId) {
          return Object.assign({}, client, {
            images: client.images.filter(image => image.id !== imageId)
          });
        }
        return client;
      }));
    
      setClients(clients.map(client => {
        if (client.id === clientId) {
          return Object.assign({}, client, {
            images: client.images.filter(image => image.id !== imageId)
          });
        }
        return client;
      }));
      
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  const normalStyle = {
    width: '100px',
    height: 'auto',
    cursor: 'pointer',
  };

  const maximizedStyle = {
    width: '90%', 
    height: 'auto',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000',
    cursor: 'pointer',
  };

  return (

    <div className='container'>
      <div className="crud-portfolio">

        <form className="crud-form" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            maxLength="100"
            value={newClient.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            maxLength="250"
            value={newClient.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Link URL"
            pattern="https?://.+"
            title="Enter a valid URL starting with http:// or https://"
            value={newClient.link}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={newClient.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <button type="submit">
            {newClient.id === null ? 'Add Client' : 'Update Client'}
          </button>
          <button type="button" onClick={resetForm}>
            Reset
          </button>
        </form>

        <div className="portfolio-list">

          <div className='checkbox-container'>
          <label htmlFor="all">All</label>
          <input
            type="checkbox"
            id="all"
            checked={show === 'all'}
            className="toggle-button"
            onChange={() => handleToggle('all')}
          />
          
          <label htmlFor="active">Active</label>
          <input
            type="checkbox"
            id="active"
            checked={show === 'active'}
            className="toggle-button"
            onChange={() => handleToggle('active')}
          />
          
          <label htmlFor="discontinued">Discontinued</label>
          <input
            type="checkbox"
            id="discontinued"
            checked={show === 'discontinued'}
            className="toggle-button"
            onChange={() => handleToggle('discontinued')}
          />
        </div>

          {clients.length === 0 ? (
            <p>No clients to display.</p>
          ) : (
            clients.map((client) => (
              <div key={client.id} className={`portfolio-client`}>
                <h2>{client.title}</h2>
                <p>{client.description}</p>

                <h3>Images:</h3>
                <div className='grid-style'>
                  {client.images.map((image) => (
                    <div key={image.id} className='remove-image-container'>
                      <img
                        src= { process.env.REACT_APP_BACKEND_URL + '/images/' + image.id + '-' + client.id + '-' + image.filename }
                        alt="Client"
                      
                        className="image-style"

                        // Apply the style based on maximized state
                        style={maximizedImage === image.id ? maximizedStyle : normalStyle} 

                        // Toggle image size on click
                        onClick={() => toggleImageSize(image.id)} 
                      />
                      
                      <DeleteForeverIcon  
                        onClick={() => deleteImage(client.id, image.id)} style={{ fontSize: 40, color: 'red', cursor: 'pointer' }}>
                      </DeleteForeverIcon>
                      
                    </div>
                  ))}
                </div>
              
                <div className="view-anchor">  
                  <a href={client.link} target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </div>

                <div className="upload-files">
                  <input type="file" multiple onChange={handleFileChange} />
                  <button onClick={() => handleUpload(client.id)} key={client.id}>Upload images</button>
                </div>

                <p>Status: {client.status}</p>
                <button onClick={() => handleEdit(client)} className="edit-client-button">Edit</button>
                <button onClick={() => handleDelete(client.id)}className="delete-client-button">Delete client</button>

                { message && <p>{message}</p> }

              </div>
            ))
          )}
        </div>
      </div>
    </div>  
  );
};

export default PortfolioCRUD;

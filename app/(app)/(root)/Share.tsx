import { useContext } from 'react';

import { useState } from 'react';
import { request } from '../../../utils/axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { MapIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return request.post('/posts', newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleClick = (e: any) => {
    e.preventDefault();
    mutation.mutate();
  };

  const { currentUser } = useAuth();
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`Create new Event`}
            onChange={(e: any) => setDesc(e.target.value)}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={(e: any) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <PhotoIcon />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <MapIcon />
              <span>Add Place</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

import Share from './Share';
import { request } from '../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';

import { Box, Grid, Stack } from '@mui/material';
import useAuth from '../../../Hooks/authContext';

const Profile = () => {
  const userid = parseInt(useLocation().pathname.split('/')[2]);

  const { currentUser } = useAuth();

  const queryClient = useQueryClient();

  const {
    isLoading: userLoading,
    error: userError,
    data: user,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      request.get('/businesses/find/' + userid).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: followersLoading,
    error: followerError,
    data: followers,
  } = useQuery({
    queryKey: ['followersQuery'],
    queryFn: () =>
      request.get('/relationship?id=' + userid).then((res) => {
        return res.data;
      }),
  });

  const followMutation = useMutation({
    mutationFn: (following: any) => {
      if (following) return request.delete('/relationship?id=' + userid);
      return request.post('/relationship?id=' + userid);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['followersQuery'] });
    },
  });

  const handleFollow = () => {
    followMutation.mutate(followers?.includes(currentUser));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {userLoading || followersLoading ? (
        'Loading'
      ) : userError ? (
        'Error'
      ) : (
        <div className="profile">
          <div className="profileContainer">
            <Grid container>
              <Grid spacing={2} size={4}>
                <Stack>
                  <div className="profile">
                    <img src={user.profilepic} />
                  </div>
                  <div>
                    <span>{user.name}</span>
                  </div>
                  <div>{followersLoading ? 'Loading' : followers.length} followers</div>
                  <div>
                    <span>{user.city}</span>
                  </div>
                  <div>
                    <span>{user.website}</span>
                  </div>
                  {currentUser.id == userid ? <a>edit</a> : <div />}
                </Stack>
              </Grid>
              <Grid spacing={4} size={8} alignContent={'stretch'}>
                {currentUser.id == userid ? (
                  <Share />
                ) : followersLoading ? (
                  'Loading'
                ) : followers.includes(currentUser.id) ? (
                  <button onClick={handleFollow}>following</button>
                ) : (
                  <button onClick={handleFollow}>follow</button>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Profile;

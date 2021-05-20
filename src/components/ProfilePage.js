import React from 'react'
import Toolbar from '@material-ui/core/Toolbar';

const ProfilePage = ({ user }) => {
    return (
        <main>
        <Toolbar />
        <div>
            --------------------------------------------- Profile Page placeholder :D ---------------------------------------------
            --------------------------------------------- Hello { user.displayName } ---------------------------------------------
        </div>
        </main>
    )
}

export default ProfilePage

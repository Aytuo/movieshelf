import type { ReactNode } from 'react';

type ProfileUsernameLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

const ProfileUsernameLayout = ({
  children,
  modal,
}: ProfileUsernameLayoutProps) => {
  return (
    <>
      {children}

      {modal}
    </>
  );
};

export default ProfileUsernameLayout;

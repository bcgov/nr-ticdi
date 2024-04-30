import { Routes, Route } from 'react-router-dom';
import LandingPage from '../content/pages/LandingPage';
import ContentWrapper from '../content/ContentWrapper';
import SearchPage from '../content/pages/SearchPage';
import SystemAdministration from '../content/pages/SystemAdministration';
import AdminPage from '../content/pages/AdminPage';
import ManageDocumentsPage from '../content/pages/ManageDocumentsPage';
import ManageTemplatesPage from '../content/pages/ManageTemplatesPage';
import ManageProvisionsPage from '../content/pages/ManageProvisionsPage';
import { ProtectedRoute } from './protected-routes';
import Roles from '../roles';
import NotAuthorizedPage from '../content/pages/NotAuthorizedPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={`/`}
        element={
          <ContentWrapper>
            <LandingPage />
          </ContentWrapper>
        }
      />

      <Route
        path={`/search`}
        element={
          <ContentWrapper>
            <SearchPage />
          </ContentWrapper>
        }
      />

      <Route
        path={`/system-admin`}
        element={
          <ProtectedRoute requiredRoles={[Roles.TICDI_ADMIN]}>
            <ContentWrapper>
              <SystemAdministration />
            </ContentWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path={`/manage-admins`}
        element={
          <ProtectedRoute requiredRoles={[Roles.TICDI_ADMIN]}>
            <ContentWrapper>
              <AdminPage />
            </ContentWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path={`/manage-doc-types`}
        element={
          <ProtectedRoute requiredRoles={[Roles.TICDI_ADMIN]}>
            <ContentWrapper>
              <ManageDocumentsPage />
            </ContentWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path={`/manage-templates`}
        element={
          <ProtectedRoute requiredRoles={[Roles.TICDI_ADMIN]}>
            <ContentWrapper>
              <ManageTemplatesPage />
            </ContentWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path={`/manage-provisions`}
        element={
          <ProtectedRoute requiredRoles={['Roles.TICDI_ADMIN']}>
            <ContentWrapper>
              <ManageProvisionsPage />
            </ContentWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path={`/not-authorized`}
        element={
          <ContentWrapper>
            <NotAuthorizedPage />
          </ContentWrapper>
        }
      />

      <Route
        path={`/dtid/:dtidNumber`}
        element={
          <ContentWrapper>
            <LandingPage />
          </ContentWrapper>
        }
      />

      <Route
        path={`/dtid/:dtidNumber/:docTypeFromUrl`}
        element={
          <ContentWrapper>
            <LandingPage />
          </ContentWrapper>
        }
      />
    </Routes>
  );
}

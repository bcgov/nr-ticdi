import { Routes, Route } from 'react-router-dom'
import LandingPage from '../content/pages/LandingPage';
import ContentWrapper from '../content/ContentWrapper';
import SearchPage from '../content/pages/SearchPage';
import SystemAdministration from '../content/pages/SystemAdministration';
import AdminPage from '../content/pages/AdminPage';
import ManageDocumentsPage from '../content/pages/ManageDocumentsPage';
import ManageTemplatesPage from '../content/pages/ManageTemplatesPage';
import ManageProvisionsPage from '../content/pages/ManageProvisionsPage';

export default function AppRoutes(){
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
                <ContentWrapper>
                    <SystemAdministration />
                </ContentWrapper>
                }
            />

            <Route
                path={`/manage-admins`}
                element={
                <ContentWrapper>
                    <AdminPage />
                </ContentWrapper>
                }
            />

            <Route
                path={`/manage-doc-types`}
                element={
                <ContentWrapper>
                    <ManageDocumentsPage />
                </ContentWrapper>
                }
            />

            <Route
                path={`/manage-templates`}
                element={
                <ContentWrapper>
                    <ManageTemplatesPage />
                </ContentWrapper>
                }
            />

            <Route
                path={`/manage-provisions`}
                element={
                <ContentWrapper>
                    <ManageProvisionsPage />
                </ContentWrapper>
                }
            />

            <Route path={`/dtid/:dtidNumber`} element={
                <ContentWrapper>
                    <LandingPage />
                </ContentWrapper>
            }/>

            <Route path={`/dtid/:dtidNumber/:docTypeFromUrl`} element={
                <ContentWrapper>
                    <LandingPage />
                </ContentWrapper>
                }/>
            </Routes>
    )
}
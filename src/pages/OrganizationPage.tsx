import Header from "../components/Header";
import OrganizationDetails from "../components/OrganizationDetails";

const OrganizationPage = () => {
  return (
    <body className="bg-white">
      <Header />
      <main className=" ms-sm-auto after-login">
        <div className="container-fluid">
          {/* to show details of organization UI */}
          <OrganizationDetails />
        </div>
      </main>
    </body>
  );
};
export default OrganizationPage;

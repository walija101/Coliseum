function AdminHome(){
    const ticketsCount = 1; 
  
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-gold text-fontBrown rounded shadow-md">
          <p className="text-lg font-semibold text-center">
            {ticketsCount > 0 ? (
              <>
                {`${ticketsCount} new Ban Requests`}{" "}
                <a href="/admin/banRequests" className="flex flex-col bg-fontBrown text-white p-2 mt-2 rounded-lg">
                  View Ban Requests
                </a>
              </>
            ) : (
              "No Ban Requests"
            )}
          </p>
        </div>
  
        
      </div>
    );
}

export default AdminHome;

const Jam = ({activeUsers, jam_code, setConnectedJam, connectedJam}) => {
  return (
    <div>
      {/* <h2>Active Users (Jam Codes)</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {activeUsers && activeUsers.length>0 && activeUsers.map((user, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
            {user.code === parseInt(jam_code) ? (
              <strong>You: {user.code}</strong>
            ) : (
              <span onClick={()=>connectedJam?setConnectedJam(null):setConnectedJam(user.code)}>{connectedJam?"Cancel":"Connect"}: {user.code}</span>
            )}
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default Jam
package entity;


public class Client{
	private String ipAddress;
	private String hostName;
	private String status;
	private String loggedInAs;
	
	public Client(String ipAddress, String hostName, String status, String loggedInAs) {
		this.ipAddress = ipAddress;
		this.hostName = hostName;
		this.status = status;
		this.loggedInAs = loggedInAs;
	}
	
	public String getIpAddress() {
		return ipAddress;
	}
	
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	
	public String getHostName() {
		return hostName;
	}
	
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setLoggedInAs(String loggedInAs) {
		this.loggedInAs = loggedInAs;
	}
	
	public String getLoggedInAs() {
		return loggedInAs;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public Boolean equals(Client other) {
		if(this.ipAddress == other.getIpAddress() && this.hostName == other.getHostName()) {
			return true;
		}
		return false;
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "Client - [IP: " + ipAddress + ", Host: " + hostName + ", Status: " + status + ", Logged in as: " + loggedInAs + "]";
	}
}

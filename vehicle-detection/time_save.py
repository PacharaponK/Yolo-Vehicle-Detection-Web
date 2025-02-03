import datetime

# Get the current datetime
now = datetime.datetime.now()

# Separate date and time
current_date = now.date()
current_time = now.time()

print("Date:", current_date)
print("Time:", current_time)
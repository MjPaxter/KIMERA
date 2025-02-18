import os

repeat="T"
added_groups=[]

while(repeat=="T"):
    os.system('cls' if os.name == 'nt' else 'clear')

    print(f"Added groups in this section: {added_groups}\n")

    group_name = input("Please enter the group name: ")
    group_token=input("Please enter the group token: ")
    group_psw=input("Please enter the group password: ")

    group_input_file_path = 'group.yaml'  # group input file
    nginx_input_file_path = '../nginx/nginx_template.yaml'  # nginx input file

    group_output_file_path = f'generated_files/{group_name}.yaml'  # group output file
    nginx_output_file_path = '../nginx/nginx.yaml'  # nginx output file

    storage_directory_path= f'../storages/groups/{group_name}'


    ################ PROCESSING GROUP FILE ###########################
    # Read from the group input file
    with open(group_input_file_path, 'r') as input_file:
        group_content = input_file.read()

    group_content = group_content.replace('groupname', group_name)
    group_content = group_content.replace('grouptoken', group_token)
    group_content = group_content.replace('grouppassword', group_psw)

    # Write the modified content to the group output file
    with open(group_output_file_path, 'w') as output_file:
        output_file.write(group_content)
    ################ PROCESSING GROUP FILE ###########################
        

    ################ PROCESSING NGINX FILE ###########################
    # Read from the nginx input file
    with open(nginx_input_file_path, 'r') as input_file:
        lines = input_file.readlines()

        # Exclude the first line 
        nginx_content = ''.join(lines[1:])

    nginx_content = nginx_content.replace('groupname', group_name)

    # Write the modified content to the nginx output file
    with open(nginx_output_file_path, 'a') as output_file:
        output_file.write(nginx_content)
    ################ PROCESSING NGINX FILE ###########################
        

    ################ CREATING STORAGE DIRECTORY ######################
    os.mkdir(storage_directory_path) 
    ################ CREATING STORAGE DIRECTORY ######################



    print(f'\nSuccessfully created yaml file for group "{group_name}"\n')

    added_groups.append(group_name)

    repeat = input("If another group needs to be added type [T] otherwise type anything else. Answer: ")

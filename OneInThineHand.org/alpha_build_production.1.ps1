# yarn version --patch


# # Move-Item .\src\assets\scriptures ..

# # ng build --prod

# # Copy-Item ..\scriptures dist\assets -Recurse


# docker build . -t scriptures_project_v3_alpha

# docker save scriptures_project_v3_alpha -o .\scriptures_project_v3_alpha

# scp scriptures_project_v3_alpha jared@192.168.1.150:/home/jared/v3
# # scp scriptures.tar.gz jared@192.168.1.150:/home/jared/v3


# ssh -t jared@192.168.1.150 'docker load -i /home/jared/v3/scriptures_project_v3_alpha'

# ssh -t jared@192.168.1.150 'docker kill scriptures_project_v3_alpha'

# ssh -t jared@192.168.1.150 'docker run -d -e "VIRTUAL_HOST=alpha.scripturesproject.review" -e "LETSENCRYPT_HOST=alpha.scripturesproject.review" -e "LETSENCRYPT_EMAIL=jared@parkinson.im" -p 11000 -it --rm --name scriptures_project_v3_alpha scriptures_project_v3_alpha'



yarn version --patch

# (Get-Content .\package.json)[2] | Out-File .\src\assets\version.txt

yarn build:web

Set-Location .\dist

tar -czf ../alpha.tar.gz *.*
Set-Location ..
scp -P 7822 alpha.tar.gz oneinthi@oneinthinehand.org:alpha.oneinthinehand.org/

ssh -t oneinthi@oneinthinehand.org -p 7822 'cd alpha.oneinthinehand.org && tar xvf alpha.tar.gz'

Remove-Item .\alpha.tar.gz
# Set-Location ..

// Create folder
export async function fetchCreateFolder(
  auth: string | null,
  data: {},
  fileName: string,
) {
  const folderObj = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
      // uploadType: 'resumable',
    },
    body: JSON.stringify({
      name: 'Finner',
      mimeType: 'application/vnd.google-apps.folder',
    }),
  })
    .then(response => response.json())
    .then(async folderData => {
      await fetchCreateFile(auth, data, folderData?.id, fileName);
      return folderData;
    })
    .catch(error => console.error('Error:', error));

  return await folderObj;
}

// FindFolder
export async function fetchFindFolder(auth: string | null) {
  const folders = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=trashed%3Dfalse`,
    {
      method: 'GET',
      headers: {
        Authorization: auth,
        Accept: 'application/json',
      },
    },
  )
    .then(response => response.json())
    .then(res => {
      return res;
    })
    .catch(error => console.error('Error:', error));

  return await folders;
}

// Copy file to folder
export async function copyFileToFolder(
  url: string,
  auth: string,
  folderId: string,
  fileName: string,
) {
  fetch(`${url}/copy`, {
    method: 'POST', // Change file name
    headers: {
      Authorization: auth,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // uploadType: `resumable`,
    },
    body: JSON.stringify({
      name: fileName,
      parents: [folderId],
    }),
  })
    .then(res => {
      // console.log('move: ', res);
      // Delete old file at root folder
      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: auth,
          Accept: 'application/json',
        },
      });
    })
    .catch(error => console.error('Error:', error));
}

// Create file
export async function fetchCreateFile(
  auth: string | null,
  data: {},
  folderId: string,
  fileName: string,
) {
  await fetch(`https://www.googleapis.com/upload/drive/v3/files`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
      uploadType: 'resumable',
      mimeType: 'text/plain',
    },
    body: JSON.stringify({
      data: data,
    }),
  })
    .then(response => response.json())
    .then(async res => {
      // console.log('File: ', res);
      // setFile(data);
      await copyFileToFolder(
        `https://www.googleapis.com/drive/v3/files/${res?.id}`,
        auth,
        folderId,
        fileName,
      );
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

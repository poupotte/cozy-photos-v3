import styles from '../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import UploadButton from '../components/UploadButton'
import DeleteButton from '../components/DeleteButton'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { uploadPhotos, showSelectionBar } from '../actions'
import { mustShowSelectionBar } from '../reducers'
import { getCurrentAlbum, deleteAlbum } from '../ducks/albums'

import classNames from 'classnames'

export const Toolbar = ({ t, disabled = false, uploadPhotos, deleteAlbum, selectItems, album, viewName }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    {viewName === 'photos' && [
      <UploadButton
        className='coz-desktop'
        onUpload={uploadPhotos}
        disabled={disabled}
        label={t('Toolbar.photo_upload')}
      />,
      <MenuButton className='coz-mobile'>
        <button
          role='button'
          className={classNames('coz-btn', 'coz-btn--more', styles['coz-btn--more'], styles['pho-toolbar-btn'])}
          disabled={disabled}
        >
          <span className='coz-hidden'>{ t('Toolbar.more') }</span>
        </button>
        <Menu className={styles['coz-menu']}>
          <Item>
            <UploadButton
              onUpload={uploadPhotos}
              disabled={disabled}
              label={t('Toolbar.menu.photo_upload')}
              type='menu-item'
            />
          </Item>
          <hr />
          <Item>
            <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
              {t('Toolbar.menu.select_items')}
            </a>
          </Item>
        </Menu>
      </MenuButton>
    ]}
    {viewName === 'albumContent' && [
      <DeleteButton
        className='coz-desktop'
        onDelete={() => deleteAlbum(album)}
        disabled={disabled}
        label={t('Toolbar.album_delete')}
      />,
      <MenuButton className='coz-mobile'>
        <button
          role='button'
          className={classNames('coz-btn', 'coz-btn--more', styles['coz-btn--more'], styles['pho-toolbar-btn'])}
          disabled={disabled}
        >
          <span className='coz-hidden'>{ t('Toolbar.more') }</span>
        </button>
        <Menu className={styles['coz-menu']}>
          <Item>
            <DeleteButton
              onDelete={() => deleteAlbum(album)}
              disabled={disabled}
              label={t('Toolbar.menu.album_delete')}
              type='menu-item'
            />
          </Item>
          <hr />
          <Item>
            <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
              {t('Toolbar.menu.select_items')}
            </a>
          </Item>
        </Menu>
      </MenuButton>
    ]}
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  disabled: mustShowSelectionBar(state),
  album: getCurrentAlbum(state.albums)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadPhotos: photo => dispatch(uploadPhotos(photo)),
  selectItems: () => dispatch(showSelectionBar()),
  deleteAlbum: album => /* before deleting, ask in a modal */dispatch(deleteAlbum(album))
  .then(() => console.log('go to albums lists view'))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Toolbar))
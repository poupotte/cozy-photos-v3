import styles from '../../../styles/toolbar'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from '../../../lib/I18n'

import ShareButton from '../../../components/ShareButton'
import Alerter from '../../../components/Alerter'
import Menu, { Item } from '../../../components/Menu'

import { showSelectionBar } from '../../../actions'
import { mustShowSelectionBar } from '../../../reducers'
import { deleteAlbum } from '..'
import DestroyConfirm from '../../../components/DestroyConfirm'
import confirm from '../../../lib/confirm'
import { ShareModal } from '../../sharing'

import classNames from 'classnames'

class AlbumToolbar extends Component {
  state = {
    showShareModal: false
  }

  showShareModal = () => {
    this.setState({ showShareModal: true })
  }

  closeShareModal = () => {
    this.setState({ showShareModal: false })
  }

  render () {
    const { t, album, disabled = false, deleteAlbum, selectItems, shareAlbum, onRename } = this.props
    return (
      <div className={styles['pho-toolbar']} role='toolbar'>
        <div className='coz-desktop'>
          <ShareButton
            label={t('Albums.share.cta')}
            onClick={this.showShareModal} />
        </div>
        <Menu
          title={t('Toolbar.more')}
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          buttonClassName={styles['pho-toolbar-more-btn']}
        >
          <Item>
            <a className={classNames(styles['pho-action-share'], 'coz-mobile')} onClick={() => shareAlbum(album)}>
              {t('Albums.share.cta')}
            </a>
          </Item>
          <Item>
            <a className={classNames(styles['pho-action-rename'])} onClick={onRename}>
              {t('Toolbar.menu.rename_album')}
            </a>
          </Item>
          <hr className='coz-mobile' />
          <Item>
            <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
              {t('Toolbar.menu.select_items')}
            </a>
          </Item>
          <hr />
          <Item>
            <a className={classNames(styles['pho-action-delete'])} onClick={() => deleteAlbum(album)}>
              {t('Toolbar.menu.album_delete')}
            </a>
          </Item>
        </Menu>
        {this.state.showShareModal && <ShareModal document={album} onClose={this.closeShareModal} />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  disabled: mustShowSelectionBar(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  selectItems: () => dispatch(showSelectionBar()),
  deleteAlbum: album => confirm(
    <DestroyConfirm t={ownProps.t} albumName={album.name} />,
    () => dispatch(deleteAlbum(album))
      .then(() => ownProps.router.replace('albums'))
      .then(() => Alerter.success('Albums.remove_album.success', {name: album.name}))
      .catch(() => Alerter.error('Albums.remove_album.error.generic'))
  )
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumToolbar)))
